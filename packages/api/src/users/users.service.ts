import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import * as format from 'pg-format';
import * as bcrypt from 'bcrypt';

import fileStorageSystem from '../config/fileStorageSystem';
import { oidcConstants } from '../auth/oidcConstants';
import {
  UsersDTO,
  UsersDetailedDTO,
  UsersInfosDTO,
  UsersLightDTO,
  UsersPatchPersoInfoDTO,
  UsersIdentityDTO,
  UsersLinksDTO,
  UsersGeoDataDTO,
  UsersCreateFullDTO,
  UsersStatesDataDTO,
  UsersPermissionsDTO,
  UsersTCPUpsertDTO,
} from './dto';
import { SubjectDTO } from './subject.dto';
import { disableUsers, upsertUsers } from './queries';
import { User } from '../model/users.entity';
import { Client } from '../model/clients.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    @InjectRepository(Client) private readonly clientsRepo: Repository<Client>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  // Find all clients
  async all(): Promise<UsersLightDTO[] | undefined> {
    return this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.addresses',
        'a',
        `a.is_active = true
            AND a.is_archived = false
            AND a.create_date_time = (SELECT MAX(a1.create_date_time)
                                      FROM addresses a1
                                      WHERE a1.is_active = true
                                        AND a1.is_archived = false
                                        AND a1.user_id = user.id
                                      )
          `,
      ) // Joining active and non archived addresses, and retreave only the most recent
      .orderBy('user.family_name', 'ASC')
      .getMany()
      .then((users) => {
        return Promise.all(
          users?.map(async (user) => {
            if (user?.picture) {
              const duration = 60; // 60s
              // get signed url from the object storage system
              await fileStorageSystem
                .signedUrl(user?.picture, duration)
                .then((url) => (user.picture = url))
                .catch(console.error);
            }
            return UsersLightDTO.fromEntity(user);
          }) || undefined,
        );
      });
  }

  // Find user by identity
  async findByIdentity(identity: string): Promise<UsersInfosDTO | undefined> {
    return this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.usersClients', 'uc') // select the pivot relation usersClients and add alias
      .where(
        `
        ((user.email IS NOT NULL AND NULLIF(user.email, '') IS NOT NULL AND user.email = TRIM(:identity))
        OR (user.login IS NOT NULL AND NULLIF(user.login, '') IS NOT NULL AND user.login = TRIM(:identity))
        OR (user.phone_number IS NOT NULL AND NULLIF(user.phone_number, '') IS NOT NULL AND user.phone_number = TRIM(:identity))
        )`,
        {
          identity,
        },
      )
      .andWhere('user.is_active = true AND user.is_archived = false')
      .andWhere('uc.client_id = :clientId', {
        clientId: oidcConstants.clientLauncherId,
      })
      .getOne()
      .then((user) => {
        return user ? UsersInfosDTO.fromEntity(user) : undefined;
      });
  }

  /**
   * Find user by identity and update password
   * @param {string} identity the email or login to identify the user
   * @param {string} password the new password
   * @returns {string} the email of the updated user
   */
  async ChangePwdByIdentity(
    identity: string,
    lastChangedDateTime: number,
    password: string,
  ): Promise<string> {
    // Hashing password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password.trim(), salt);

    const uptd = await this.repo
      .createQueryBuilder('user')
      .update(User)
      .set({ password: hash })
      .where(
        `
        ((user.email IS NOT NULL AND NULLIF(user.email, '') IS NOT NULL AND user.email = TRIM(:identity))
        OR (user.login IS NOT NULL AND NULLIF(user.login, '') IS NOT NULL AND user.login = TRIM(:identity))
        OR (user.phone_number IS NOT NULL AND NULLIF(user.phone_number, '') IS NOT NULL AND user.phone_number = TRIM(:identity))
        )`,
        { identity },
      )
      // Used to check if data has already been updated
      .andWhere('LEFT(last_changed_date_time::text, 23) = :lcdt', {
        lcdt: new Date(lastChangedDateTime)
          .toISOString()
          .slice(0, 23)
          .replace('T', ' '),
      })
      .returning('email')
      .execute();
    return uptd?.raw?.[0]?.email || '';
  }

  // Find user by id
  async findById(id: string): Promise<UsersDetailedDTO | undefined> {
    return this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.addresses',
        'a',
        `a.is_active = true
        AND a.is_archived = false
        AND a.create_date_time = (SELECT MAX(a1.create_date_time)
                                  FROM addresses a1
                                  WHERE a1.is_active = true
                                    AND a1.is_archived = false
                                    AND a1.user_id = user.id
                                  )
      `,
      ) // Joining active and non archived addresses, and retreave only the most recent
      .orderBy('user.family_name', 'ASC')
      .where('user.id = :id', { id })
      .getOne()
      .then(async (user) => {
        if (user?.picture) {
          const duration = 60; // 60s
          // get signed url from the object storage system
          await fileStorageSystem
            .signedUrl(user?.picture, duration)
            .then((url) => (user.picture = url))
            .catch(console.error);
        }
        return user ? UsersDetailedDTO.fromEntity(user) : undefined;
      });
  }

  // Find user by subject id and clientId
  async findBySub(
    subId: string,
    clientId: string,
  ): Promise<SubjectDTO | undefined> {
    const user = await this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.usersClients', 'uc') // select the pivot relation usersClients and add alias
      .leftJoinAndSelect('user.addresses', 'ad') // select the relation addresses and add alias
      .where('uc.id = :id', { id: subId }) // filter by user id
      .andWhere('uc.client_id = :clientId', {
        clientId: clientId,
      })
      .getOne();
    return user
      ? SubjectDTO.fromEntity({ ...user, id: subId }, false)
      : undefined;
  }

  // For a given user and a given client check the consent of the user
  async checkConsent(userId: string, clientId: string): Promise<boolean> {
    const users = await this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.usersClients', 'uc') // select the pivot relation usersClients and add alias
      .where('user.id = :id', { id: userId }) // filter by user id
      .andWhere('uc.client_id = :clientId', {
        clientId: clientId,
      }) // filter by client id
      .andWhere('uc.authorization = :consent', {
        consent: true,
      }) // filter by authorizations
      .getOne();
    return !!users?.usersClients?.[0]?.authorization; // return the authorization value or false else
  }

  // Selection the id of the user_clients table row find by userId and clientId
  async getUserClientId(userId: string, clientId): Promise<string | undefined> {
    const userClient = await this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.usersClients', 'uc') // select the pivot relation usersClients and add alias
      .select('DISTINCT ON (uc.id) uc.id')
      .where('user.id = :id', { id: userId }) // filter by user id
      .andWhere('uc.client_id = :clientId', {
        clientId: clientId,
      })
      .getRawOne();
    return userClient?.id;
  }

  // Store a new user
  public async create(dto: UsersDTO): Promise<UsersDTO> {
    return this.repo.save(dto.toEntity()).then((e) => UsersDTO.fromEntity(e));
  }

  // Find all users
  async getAll(): Promise<UsersDTO[] | undefined> {
    return this.repo.find().then((user) => {
      return user ? user.map((u) => UsersDTO.fromEntity(u)) : undefined;
    });
  }

  // Disabled all users link to the subject_id and the client_id
  async disableBySubIds(
    // TODO
    subsId: string[],
    clientId: string,
  ): Promise<number> {
    // Generate the sql query
    const sql = format(disableUsers, subsId, clientId);
    const usersData = await this.entityManager.query(sql);
    return usersData?.length || 0;
  }

  // Upsert all users link to the subject_id and the client_id
  async upsertBySubIds(
    users: {
      usersArray: any[];
      addressesArray: any[];
    },
    clientId: string,
  ): Promise<UsersTCPUpsertDTO[] | undefined> {
    console.log('users?.usersDTO', users?.usersArray);
    console.log('users?.addresses', users?.addressesArray);

    // Generate the sql query
    const sql = format(
      upsertUsers,
      users?.usersArray,
      users?.addressesArray,
      clientId,
      oidcConstants.clientLauncherId,
    );

    const usersData = await this.entityManager.query(sql);
    return usersData;
  }

  /**
   * Method used to patch the profile picture of an user
   * @param {string} userId The id of the target user
   * @param {string} picture the new picture to store
   * @returns {boolean} true if the path has been saved, false otherwise
   */
  async patchPicture(userId: string, picture: string): Promise<boolean> {
    return this.repo.update(userId, { picture }).then((user) => {
      return user?.affected === 1;
    });
  }

  /**
   * Method used to patch the personnal information of an user
   * @param {string} userId The id of the target user
   * @param {UsersPatchPersoInfoDTO} userPersoInfo the new personnal information to update
   * @returns {UsersPatchPersoInfoDTO | string} personnal information if had been saved, empty string otherwise
   */
  async patchPersonnalInformation(
    userId: string,
    userPersoInfo: UsersPatchPersoInfoDTO,
  ): Promise<UsersPatchPersoInfoDTO | string> {
    // We format the data in order to generate the full name
    const formattedUserPersoInfo = UsersPatchPersoInfoDTO.from(userPersoInfo);

    const hasBeenUpdated = await this.repo
      .update(userId, formattedUserPersoInfo)
      .then((user) => {
        return user?.affected === 1;
      });

    return hasBeenUpdated ? formattedUserPersoInfo : '';
  }

  /**
   * Method used to patch identity information of an user
   * @param {string} userId The id of the target user
   * @param {UsersIdentityDTO} userIdentity the new identity information to update
   * @returns {UsersIdentityDTO | ''} identity if had been saved, empty string otherwise
   */
  async patchIdentity(
    userId: string,
    userIdentity: UsersIdentityDTO,
  ): Promise<UsersIdentityDTO | ''> {
    // We format the data
    const formattedUserIdentity = UsersIdentityDTO.from(userIdentity);

    const hasBeenUpdated = await this.repo
      .update(userId, formattedUserIdentity)
      .then((user) => {
        return user?.affected === 1;
      });
    return hasBeenUpdated ? formattedUserIdentity : '';
  }

  /**
   * Method used to patch the user password
   * @param {string} userId The id of the target user
   * @param {string} userPassword the new user password to update
   * @returns {boolean} true if the password has been saved, false otherwise
   */
  async patchPassword(userId: string, userPassword: string): Promise<boolean> {
    // Hashing password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(userPassword.trim(), salt);

    return this.repo.update(userId, { password: hash }).then((user) => {
      return user?.affected === 1;
    });
  }

  /**
   * Method used to patch external links profile and website
   * @param {string} userId The id of the target user
   * @param {UsersLinksDTO} userLinks new external links profile and website to update
   * @returns {UsersLinksDTO | string} external links profile and website if had been saved, empty string otherwise
   */
  async patchLinks(
    userId: string,
    userLinks: UsersLinksDTO,
  ): Promise<UsersLinksDTO | string> {
    const hasBeenUpdated = await this.repo
      .update(userId, userLinks)
      .then((user) => {
        return user?.affected === 1;
      });
    return hasBeenUpdated ? userLinks : '';
  }

  /**
   * Method used to patch geographique data zoneinfo and locale
   * @param {string} userId The id of the target user
   * @param {UsersGeoDataDTO} userGeoData new geographique data zoneinfo and locale to update
   * @returns {UsersGeoDataDTO | string} geographique data zoneinfo and locale if had been saved, empty string otherwise
   */
  async patchGeoData(
    userId: string,
    userGeoData: UsersGeoDataDTO,
  ): Promise<UsersGeoDataDTO | string> {
    const hasBeenUpdated = await this.repo
      .update(userId, userGeoData)
      .then((user) => {
        return user?.affected === 1;
      });
    return hasBeenUpdated ? userGeoData : '';
  }

  /**
   * Method used to patch states data isArchived and isActive of a specific user
   * @param {string} userId The id of the target user
   * @param {UsersGeoDataDTO} userStatesData new states data isArchived and isActive to update
   * @returns {UsersStatesDataDTO | string} states data isArchived and isActive if had been saved, empty string otherwise
   */
  async patchStatesData(
    userId: string,
    userStatesData: UsersStatesDataDTO,
  ): Promise<UsersStatesDataDTO | string> {
    const hasBeenUpdated = await this.repo
      .update(userId, userStatesData)
      .then((user) => {
        return user?.affected === 1;
      });
    return hasBeenUpdated ? userStatesData : '';
  }

  /**
   * Method used to patch states data isArchived and isActive of a specific user
   * @param {string} userId The id of the target user
   * @returns {UsersPermissionsDTO | string} permissions of a user for all clients if founded else undefined
   */
  async getPermissions(
    userId: string,
  ): Promise<UsersPermissionsDTO[] | undefined> {
    return this.clientsRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect(
        'c.usersClients',
        'uc',
        `uc.user_id = '${userId}'::uuid`,
      )
      .leftJoinAndSelect('uc.user', 'u', `u.id = '${userId}'::uuid`)
      .select([
        'c.id AS id',
        'c.client_name AS "clientName"',
        'c.permissions AS permissions',
        'c.logo_uri AS "logoUri"',
        'u.id AS "userId"',
        'u.name AS "userName"',
        'uc.id AS "usersClientsId"',
        'uc.role AS "usersClientsRole"',
        'uc.permissions AS "usersClientsPermissions"',
      ])
      .orderBy('c.client_name', 'ASC')
      .where('c.is_active = true')
      .andWhere('c.is_archived = false')
      .getRawMany()
      .then((permissions) =>
        Promise.all(
          permissions.map(async (p) => {
            if (p?.logoUri) {
              const duration = 60; // 60s
              // get signed url from the object storage system
              await fileStorageSystem
                .signedUrl(p?.logoUri, duration)
                .then((url) => (p.logoUri = url))
                .catch(console.error);
            }
            return UsersPermissionsDTO.from(p);
          }),
        ),
      );
  }

  // Store a new user
  public async partialCreate(
    dto: UsersCreateFullDTO,
  ): Promise<UsersDetailedDTO> {
    // We will count the number of identical login
    const loginNumber = await this.repo
      .createQueryBuilder('u')
      .select(
        // Replace by an empty string the login base (all except numbers at the end)
        // like this only the numbers remain and we select the maximum between the number and 1
        // 1 because the first login as no number so it will be skeep
        // the surrounded coalesce is to prevent null value when the "where" clause result by a null value
        `COALESCE(MAX(COALESCE(NULLIF(REPLACE(u.login, '${dto.login}', ''), '')::integer, 1)), 0) AS "max"`,
      )
      .where("login ~ CONCAT('^', :login::text, '[0-9]*')", {
        login: dto.login,
      })
      .getRawOne();

    // updating the admin with a unique auto increment number at the end
    console.log('loginNumber?.max', loginNumber?.max);
    dto.login = !loginNumber?.max
      ? dto.login
      : dto.login + (loginNumber?.max + 1);

    // Hashing password
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    dto.password = bcrypt.hashSync(dto.password, salt);

    return this.repo
      .save(dto.toEntity())
      .then((e) => UsersDetailedDTO.fromEntity(e));
  }
}
