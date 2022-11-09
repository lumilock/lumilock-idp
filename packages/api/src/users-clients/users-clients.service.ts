import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersPatchPermissionsDTO } from '../users/dto';
import { UsersClientsDTO } from './users-clients.dto';
import { UsersClients } from '../model/users_clients.entity';

@Injectable()
export class UsersClientsService {
  constructor(
    @InjectRepository(UsersClients)
    private readonly repo: Repository<UsersClients>,
  ) {}

  // if relation exist, patch authorization value
  // else create relation
  async patchOrCreateAuthorization(
    userId: string,
    clientId: string,
    authorization: boolean,
  ): Promise<void> {
    // Upsert usersClients
    // update authorization if there is conflict on the unique pair (user_id, client_id)
    await this.repo
      .createQueryBuilder('userClient')
      .insert()
      .into(UsersClients)
      .values([{ userId, clientId, authorization }])
      .onConflict(
        `("user_id", "client_id") DO UPDATE SET "authorization" = excluded."authorization"`,
      )
      .execute();
    return;
  }

  /**
   * Method used to insert or update permissions for a given user and client
   * @param {UsersPatchPermissionsDTO} userPermissions permissions data to upsert
   * @returns {Promise<UsersPatchPermissionsDTO | undefined>} upserted data
   */
  async patchPermissions(
    userPermissions: UsersPatchPermissionsDTO,
  ): Promise<UsersPatchPermissionsDTO | undefined> {
    // Upsert usersClients
    // update role and permissions if there is conflict on the unique pair (user_id, client_id)
    await this.repo
      .createQueryBuilder('userClient')
      .insert()
      .into(UsersClients)
      .values(userPermissions.toEntity())
      .orUpdate(['role', 'permissions'], ['user_id', 'client_id'], {
        skipUpdateIfNoValuesChanged: true,
      })
      .returning('*')
      .execute();
    return userPermissions;
  }

  // Store a new userClient
  public async create(dto: UsersClientsDTO): Promise<UsersClientsDTO> {
    return this.repo
      .save(dto.toEntity())
      .then((e) => UsersClientsDTO.fromEntity(e));
  }
}
