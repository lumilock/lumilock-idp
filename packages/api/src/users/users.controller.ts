import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import {
  UsersCreateDTO,
  UsersCreateFullDTO,
  UsersDetailedDTO,
  UsersLightDTO,
  UsersPatchPersoInfoDTO,
} from './dto';
import { AuthenticatedGuard, PermissionsGuard } from '../common/guards';
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
    // Get users
    const users = await this.serv.all();
    // Response
    return users;
  }

  @UseGuards(AuthenticatedGuard)
  @SetMetadata('permissions', ['clients'])
  @UseGuards(PermissionsGuard)
  @Get(':id')
  public async getById(@Param('id') id: string) {
    // Get users
    const users = await this.serv.findById(id);
    // Response
    return users;
  }

  /**
   * Method used to update personal information of a specific user
   * @param {UsersPatchPersoInfoDTO} userPersoInfo the new personnal information to update
   * @returns {UsersPatchPersoInfoDTO | undefined} the updated and formatted personnal information or nothing
   */
  @UseGuards(AuthenticatedGuard)
  @SetMetadata('permissions', ['clients'])
  @UseGuards(PermissionsGuard)
  @Patch(':id/personnal-information')
  public async patchPersonnalInformation(
    @Param('id') userId: string,
    @Body() userPersoInfo: UsersPatchPersoInfoDTO,
  ): Promise<UsersPatchPersoInfoDTO | undefined> {
    const patchedUserPersoInfo = await this.serv.patchPersonnalInformation(
      userId,
      userPersoInfo,
    );
    if (patchedUserPersoInfo && typeof patchedUserPersoInfo === 'object') {
      return patchedUserPersoInfo;
    }
    return undefined;
  }

  @UseGuards(AuthenticatedGuard)
  @SetMetadata('permissions', ['users'])
  @UseGuards(PermissionsGuard)
  @Post('/')
  public async create(@Body() body: UsersCreateDTO): Promise<UsersDetailedDTO> {
    // store user
    const user = await this.serv.partialCreate(UsersCreateFullDTO.from(body));
    // response
    return user;
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
