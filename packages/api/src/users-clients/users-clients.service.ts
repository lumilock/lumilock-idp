import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersClients } from '../model/users_clients.entity';
import { UsersClientsDTO } from './users-clients.dto';

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

  // Store a new userClient
  public async create(dto: UsersClientsDTO): Promise<UsersClientsDTO> {
    return this.repo
      .save(dto.toEntity())
      .then((e) => UsersClientsDTO.fromEntity(e));
  }
}
