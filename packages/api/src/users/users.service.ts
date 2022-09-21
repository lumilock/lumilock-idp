import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import * as format from 'pg-format';

import { oidcConstants } from '../auth/oidcConstants';
import { User } from '../model/users.entity';
import { SubjectDTO } from './subject.dto';
import { UsersDTO } from './users.dto';
import { disableUsers, upsertUsers } from './queries';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  // Find user by identity
  async findByIdentity(identity: string): Promise<UsersDTO | undefined> {
    return this.repo
      .findOne({
        where: [{ email: identity }, { login: identity }],
      })
      .then((user) => {
        return user ? UsersDTO.fromEntity(user) : undefined;
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
    const uptd = await this.repo
      .createQueryBuilder('user')
      .update(User)
      .set({ password }) // TODO hash
      .where('email = :identity OR login = :identity', { identity })
      // Used to check if data has already been updated
      .andWhere('last_changed_date_time::timestamp(3) = :lcdt', {
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
  async findById(id: string): Promise<UsersDTO | undefined> {
    return this.repo.findOne(id).then((user) => {
      return user ? UsersDTO.fromEntity(user) : undefined;
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
    // TODO
    users: any[],
    addresses: any[],
    clientId: string,
  ): Promise<UsersDTO[] | undefined> {
    // Generate the sql query
    const sql = format(
      upsertUsers,
      users,
      addresses,
      clientId,
      oidcConstants.clientLauncherId,
    );

    const usersData = await this.entityManager.query(sql);
    return usersData;
  }
}
