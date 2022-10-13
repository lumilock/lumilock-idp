import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Client } from '../model/clients.entity';
import fileStorageSystem from '../config/fileStorageSystem';
import { ClientsDTO } from './clients.dto';
import { ClientsFullDTO } from './dto';

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
