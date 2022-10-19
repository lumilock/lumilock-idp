import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthenticatedGuard, PermissionsGuard } from '../common/guards';
import { UsersLightDTO } from './dto';
import { formattedUpsertUsers } from './helpers';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly serv: UsersService) {}

  /** ****************************************************
   * [getAll]: Retreave all clients infos
   * @param req
   * @param query
   * @param res
   * @returns
   * *****************************************************/
  @UseGuards(AuthenticatedGuard)
  @SetMetadata('permissions', ['users'])
  @UseGuards(PermissionsGuard)
  @Get('/')
  public async getAll(): Promise<UsersLightDTO[] | undefined> {
    // get users
    const users = await this.serv.all();
    // response
    return users;
  }

  /** *********************************
   * **********************************
   * TCP
   * **********************************
   * **********************************/

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
    return users;
  }

  @MessagePattern({ role: 'item', cmd: 'get-by-id' })
  public async getItemById(msg) {
    console.log('getById:', msg);
    return null;
  }
}
