import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Code } from '../model/codes.entity';
import { Repository } from 'typeorm';
import { CodesDTO } from './codes.dto';

@Injectable()
export class CodesService {
  constructor(
    @InjectRepository(Code)
    private readonly repo: Repository<Code>,
  ) {}

  // Store a new code
  public async create(dto: CodesDTO): Promise<CodesDTO> {
    return this.repo.save(dto.toEntity()).then((e) => CodesDTO.fromEntity(e));
  }
}
