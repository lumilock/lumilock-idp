import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../model/clients.entity';
import { Repository } from 'typeorm';
import { ClientsDTO } from './clients.dto';
import { LightenClientsDTO } from './lightenClients.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private readonly repo: Repository<Client>,
  ) {}

  // Find client by id
  async findById(id: string): Promise<LightenClientsDTO | undefined> {
    return this.repo.findOne(id).then((user) => {
      return user ? LightenClientsDTO.fromEntity(user) : undefined;
    });
  }

  public async create(dto: ClientsDTO): Promise<ClientsDTO> {
    return this.repo.save(dto.toEntity()).then((e) => ClientsDTO.fromEntity(e));
  }
}
