import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { formattedUpsertUsers } from './helpers';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly serv: UsersService) {}

  @MessagePattern({ role: 'user', cmd: 'disable-multiple' })
  public async disableUsers({
    // TODO
    ids,
    clientId,
  }: {
    ids: string[];
    clientId: string;
  }) {
    const users = await this.serv.disableBySubIds(ids, clientId);
    console.log('users', users);
    return users;
  }

  @MessagePattern({ role: 'user', cmd: 'upsert-multiple' })
  public async upsertUsers({
    // TODO
    data,
    clientId,
  }: {
    data: any[];
    clientId: string;
  }) {
    // formatting data
    const [upsertUsers, addresses] = await formattedUpsertUsers(data);
    // calling the services in order to upsert data
    const users = await this.serv.upsertBySubIds(
      upsertUsers,
      addresses,
      clientId,
    );
    console.log('users', users);
    return users;
  }

  @MessagePattern({ role: 'item', cmd: 'get-by-id' })
  public async getItemById(msg) {
    console.log('getById:', msg);
    return null;
  }
}
