import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Permission } from '../common/enums';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';

import { ClientsService } from './clients.service';

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
  public async getAll(@Req() req, @Query() query, @Res() res: Response) {
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
      // clients = await this.serv.allBySub(subId);
    }

    // response
    return res.status(HttpStatus.OK).json(clients);
  }
}
