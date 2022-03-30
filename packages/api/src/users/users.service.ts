import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../model/users.entity';
import { SubjectDTO } from './subject.dto';
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

  // Find user by subject id and clientId
  async findBySub(
    subId: string,
    clientId: string,
  ): Promise<SubjectDTO | undefined> {
    const user = await this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.usersClients', 'uc') // select the pivot relation usersClients and add alias
      .leftJoinAndSelect('user.addresses', 'ad') // select the relation addresses and add alias
      .where('uc.id = :id', { id: subId }) // filter by user id
      .andWhere('uc.client_id = :clientId', {
        clientId: clientId,
      })
      .getOne();
    return user
      ? SubjectDTO.fromEntity({ ...user, id: subId }, false)
      : undefined;
  }

  // For a given user and a given client check the consent of the user
  async checkConsent(userId: string, clientId: string): Promise<boolean> {
    const users = await this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.usersClients', 'uc') // select the pivot relation usersClients and add alias
      .where('user.id = :id', { id: userId }) // filter by user id
      .andWhere('uc.client_id = :clientId', {
        clientId: clientId,
      }) // filter by client id
      .andWhere('uc.authorization = :consent', {
        consent: true,
      }) // filter by authorizations
      .getOne();
    return !!users?.usersClients?.[0]?.authorization; // return the authorization value or false else
  }

  // Selection the id of the user_clients table row find by userId and clientId
  async getUserClientId(userId: string, clientId): Promise<string | undefined> {
    const userClient = await this.repo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.usersClients', 'uc') // select the pivot relation usersClients and add alias
      .select('DISTINCT ON (uc.id) uc.id')
      .where('user.id = :id', { id: userId }) // filter by user id
      .andWhere('uc.client_id = :clientId', {
        clientId: clientId,
      })
      .getRawOne();
    return userClient?.id;
  }

  // Store a new user
  public async create(dto: UsersDTO): Promise<UsersDTO> {
    return this.repo.save(dto.toEntity()).then((e) => UsersDTO.fromEntity(e));
  }
}
