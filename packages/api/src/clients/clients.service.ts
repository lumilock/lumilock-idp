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

  public async create(dto: ClientsDTO): Promise<ClientsDTO> {
    return this.repo.save(dto.toEntity()).then((e) => ClientsDTO.fromEntity(e));
  }
}
