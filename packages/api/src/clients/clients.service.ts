import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from '../model/clients.entity';
import fileStorageSystem from '../config/fileStorageSystem';
import { ClientsDTO } from './dto/clients.dto';
import { ClientsFullDTO, ClientsLightDTO } from './dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private readonly repo: Repository<Client>,
  ) {}

  // Find all clients
  async all(): Promise<ClientsDTO[] | undefined> {
    return this.repo.find().then((clients) => {
      return Promise.all(
        clients?.map(async (client) => {
          if (client?.logoUri) {
            const duration = 60 * 60; // 60s * 60min = 1h in seconds
            // get signed url from the object storage system
            await fileStorageSystem
              .signedUrl(client?.logoUri, duration)
              .then((url) => (client.logoUri = url))
              .catch(console.error);
          }
          return ClientsDTO.fromEntity(client);
        }) || undefined,
      );
    });
  }

  /**
   * Method used to retreave all clients of a specifique user
   * @param id Auth user id who want to display his clients
   * @returns {ClientsLightDTO[]} the array of clients that the current user can access
   */
  async allByUser(id: string): Promise<ClientsLightDTO[] | undefined> {
    return this.repo
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.usersClients', 'uc') // select the pivot relation usersClients and add alias
      .where('client.is_active = true')
      .andWhere('client.is_archived = false')
      .andWhere('client.hide = false')
      .andWhere('uc.authorization = true')
      .andWhere('uc.user_id = :id', {
        id,
      })
      .andWhere('uc.role IN (:...role)', {
        role: ['admin', 'user', 'guest'],
      })
      .orderBy('client.client_name', 'ASC')
      .getMany()
      .then((clients) => {
        return Promise.all(
          clients?.map(async (client) => {
            if (client?.logoUri) {
              const duration = 60; // 60s * 60min = 1h in seconds
              // get signed url from the object storage system
              await fileStorageSystem
                .signedUrl(client?.logoUri, duration)
                .then((url) => (client.logoUri = url))
                .catch(console.error);
            }
            return ClientsLightDTO.fromEntity(client);
          }) || undefined,
        );
      });
  }

  // Find client by id
  async findById(id: string): Promise<ClientsFullDTO | undefined> {
    return this.repo.findOne(id).then(async (client) => {
      if (client?.logoUri) {
        const duration = 60; // 60s
        // get signed url from the object storage system
        await fileStorageSystem
          .signedUrl(client?.logoUri, duration)
          .then((url) => (client.logoUri = url))
          .catch(console.error);
      }
      return client ? ClientsFullDTO.fromEntity(client) : undefined;
    });
  }

  public async create(dto: ClientsDTO): Promise<ClientsDTO> {
    return this.repo
      .save(dto.toEntity(false))
      .then((e) => ClientsDTO.fromEntity(e, false));
  }
}
