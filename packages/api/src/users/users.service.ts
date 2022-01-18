import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/users.entity';
import { UsersDTO } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  // Find user by identity
  async findByIdentity(identity: string): Promise<UsersDTO | undefined> {
    return this.repo
      .findOne({
        where: [{ email: identity }, { login: identity }],
      })
      .then((user) => {
        return user ? UsersDTO.fromEntity(user) : undefined;
      });
  }

  // Find user by id
  async findById(id: string): Promise<UsersDTO | undefined> {
    return this.repo.findOne(id).then((user) => {
      return user ? UsersDTO.fromEntity(user) : undefined;
    });
  }

  public async create(dto: UsersDTO): Promise<UsersDTO> {
    return this.repo.save(dto.toEntity()).then((e) => UsersDTO.fromEntity(e));
  }
}
