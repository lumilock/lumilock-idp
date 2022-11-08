import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { getRandomString } from '../utils';
import { Client } from '../model/clients.entity';
import fileStorageSystem from '../config/fileStorageSystem';
import { ClientsDTO } from './dto/clients.dto';
import {
  ClientsCreateDTO,
  ClientsFullDTO,
  ClientsLightDTO,
  ClientsPermissionsDTO,
  ClientsUpdateDTO,
} from './dto';

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

  // Retrieve all permissions of a specific client
  async findPermissions(
    id: string,
  ): Promise<ClientsPermissionsDTO | undefined> {
    return this.repo
      .find({
        select: ['permissions'],
        where: {
          id,
        },
        order: {
          permissions: 'ASC',
        },
        take: 1,
        cache: true,
      })
      .then((client) => {
        return client?.[0]
          ? ClientsPermissionsDTO.fromEntity(client?.[0])
          : undefined;
      });
  }

  /**
   * Method to update client by id
   * @param {ClientsFullDTO} param0 clients params to update
   * @param {object} file client logo object file
   * @param {string} path cleint logo path to store in s3
   * @returns {ClientsUpdateDTO} all clients info stored
   */
  async update(
    { id, ...client }: ClientsUpdateDTO,
    file: object,
    path: string,
  ): Promise<ClientsUpdateDTO | undefined> {
    // checking if there is a file
    if (!file || !id) return undefined;

    // upload to object storage
    fileStorageSystem.putObject(file, path);

    // update data in
    const hasBeenSaved = await this.repo
      .update(id, { ...({ ...client, logoUri: path } || {}) })
      .then((client) => {
        return client?.affected === 1;
      });

    // sign the path in order to return it in front
    if (hasBeenSaved) {
      let logoUri = '';
      // signed path
      const duration = 60; // 60 seconds
      await fileStorageSystem
        .signedUrl(path, duration)
        .then((url) => (logoUri = url))
        .catch(console.error);

      return ClientsUpdateDTO.from({ ...client, id, logoUri });
    }

    return undefined;
  }

  public async create(dto: ClientsDTO): Promise<ClientsDTO> {
    return this.repo
      .save(dto.toEntity(false))
      .then((e) => ClientsDTO.fromEntity(e, false));
  }

  public async partialCreate(dto: ClientsCreateDTO) {
    // Generate a secret
    const secret = getRandomString(30);

    // Hashing secret
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(secret, salt);

    // adding the hashing secret
    const client = ClientsCreateDTO.from({ ...dto, secret: hash });

    return this.repo
      .save(client.toEntity())
      .then((e) =>
        ClientsCreateDTO.from({ ...ClientsCreateDTO.fromEntity(e), secret }),
      );
  }
}
