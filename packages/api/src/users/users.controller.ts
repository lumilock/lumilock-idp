import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly serv: UsersService) {}

  @MessagePattern({ role: 'user', cmd: 'update-multiple' })
  public async updateUsers(msg: any) {
    console.log('msg:----------------------------');
    console.log('msg:', msg);
    const users = await this.serv.getAll();
    console.log('users', users);
    return users;
  }

  @MessagePattern({ role: 'item', cmd: 'get-by-id' })
  public async getItemById(msg) {
    console.log('getById:', msg);
    return null;
  }
}
