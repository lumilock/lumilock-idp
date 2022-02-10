import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Code } from '../model/codes.entity';
import { LessThan, Repository } from 'typeorm';
import { CodesDTO } from './codes.dto';

@Injectable()
export class CodesService {
  constructor(
    @InjectRepository(Code)
    private readonly repo: Repository<Code>,
  ) {}

  // remove all expired codes
  public async checkExpiration(clientId: string): Promise<void> {
    // current date - 10 minutes (600 seconds)
    const unixTenMinAgo = Math.floor(Date.now() / 1000 - 600);
    const dateTenMinAgo = new Date(unixTenMinAgo * 1000);
    await this.repo.delete({
      clientId,
      create_date_time: LessThan(dateTenMinAgo),
    });
  }

  // Store a new code
  public async create(dto: CodesDTO): Promise<CodesDTO> {
    return this.repo.save(dto.toEntity()).then((e) => CodesDTO.fromEntity(e));
  }
}
