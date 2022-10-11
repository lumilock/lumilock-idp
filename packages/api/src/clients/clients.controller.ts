import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Req,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { PermissionsGuard } from '../common/guards';
// import { Permissions } from '../common/decorators/permissions.decorator';
// import { Permission } from '../common/enums/permission.enum';
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
  @SetMetadata('permissions', ['clients'])
  @UseGuards(PermissionsGuard)
  @Get('/')
  public async getAll(@Req() req, @Query() query, @Res() res: Response) {
    const user = req?.user;
    console.log('user=', user);

    // get clients
    // let clients = null;
    // if (
    //   // checking demand and permissions of the subject
    //   query?.all === 'true' &&
    //   (subjectInfos?.role === 'admin' ||
    //     subjectInfos?.permissions.includes(Permission.Clients))
    // ) {
    //   clients = await this.serv.all();
    // } else {
    //   clients = await this.serv.allBySub(subId);
    // }

    // response
    return res.status(HttpStatus.OK).json('clients');
  }
}
