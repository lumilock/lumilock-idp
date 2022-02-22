import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../model/clients.entity';
import { Repository } from 'typeorm';
import { ClientsDTO } from './clients.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private readonly repo: Repository<Client>,
  ) {}

  // Find client by id
  async findById(id: string): Promise<ClientsDTO | undefined> {
    return this.repo.findOne(id).then((user) => {
      return user ? ClientsDTO.fromEntity(user) : undefined;
    });
  }

  public async create(dto: ClientsDTO): Promise<ClientsDTO> {
    return this.repo.save(dto.toEntity()).then((e) => ClientsDTO.fromEntity(e));
  }
}
