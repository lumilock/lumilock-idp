import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Req,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { PermissionsGuard } from '../common/guards';
import { Permission } from '../common/enums';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { ClientsService } from './clients.service';
import { ClientsFullDTO, ClientsLightDTO, ClientsDTO } from './dto';

@Controller('clients')
export class ClientsController {
  constructor(private serv: ClientsService) {}

  /** ****************************************************
   * [getAll]: Retreave all clients infos
   * @param req
   * @param query
   * @param res
   * @returns
   * *****************************************************/
  @UseGuards(AuthenticatedGuard)
  // @SetMetadata('permissions', ['clients'])
  // @UseGuards(PermissionsGuard)
  @Get('/')
  public async getAll(
    @Req() req,
    @Query() query,
  ): Promise<ClientsLightDTO[] | ClientsDTO[] | undefined> {
    const user = req?.user;

    // get clients
    let clients = null;
    if (
      // checking demand and permissions of the user
      query?.all === 'true' &&
      (user?.role === 'admin' || user?.permissions.includes(Permission.Clients))
    ) {
      // Find all clients in the db
      clients = await this.serv.all();
    } else {
      // Finding only clients that user can access
      clients = await this.serv.allByUser(user?.id);
    }

    // response
    return clients;
  }

  @UseGuards(AuthenticatedGuard)
  @SetMetadata('permissions', ['clients'])
  @UseGuards(PermissionsGuard)
  @Get(':id')
  public async getById(
    @Param('id') id: string,
  ): Promise<ClientsFullDTO | undefined> {
    // get clients
    const clients = await this.serv.findById(id);
    // response
    return clients;
  }
}
