import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as sharp from 'sharp';

import {
  ClientsFullDTO,
  ClientsLightDTO,
  ClientsDTO,
  ClientsCreateDTO,
  ClientsUpdateDTO,
} from './dto';
import { PermissionsGuard } from '../common/guards';
import { Permission } from '../common/enums';
import { FileFormDataInterceptor } from '../common/interceptors';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { ClientsService } from './clients.service';
import { FileInterceptor } from '@nestjs/platform-express';

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

  /**
   * Method to update all client data
   * @param {Express.Multer.File} file the logo object file
   * @param {string} clientId id of the client
   * @param {ClientsUpdateDTO} body new data of the client
   * @returns {Promise<ClientsUpdateDTO | undefined>} the updated client data
   */
  @UseGuards(AuthenticatedGuard)
  @SetMetadata('permissions', ['clients'])
  @UseGuards(PermissionsGuard)
  @UseInterceptors(FileInterceptor('file'), new FileFormDataInterceptor('data'))
  @Put(':id')
  public async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') clientId: string,
    @Body() body: ClientsUpdateDTO,
  ): Promise<ClientsUpdateDTO | undefined> {
    // converte and resize image
    const sharpedFile = file?.buffer
      ? // eslint-disable-next-line prettier/prettier
      await sharp(file.buffer).resize(128, 128, { fit: 'cover', position: 'center' }).webp().toBuffer()
      : null;

    // generate the object path
    const path = `clients/${clientId}/icon.webp`;

    // update client
    const client = await this.serv.update(
      ClientsUpdateDTO.from(body),
      sharpedFile,
      path,
    );

    // response
    return client;
  }

  @UseGuards(AuthenticatedGuard)
  @SetMetadata('permissions', ['clients'])
  @UseGuards(PermissionsGuard)
  @Post('/')
  public async create(
    @Body() body: ClientsCreateDTO,
  ): Promise<ClientsCreateDTO> {
    // store clients
    const client = await this.serv.partialCreate(body);
    // response
    return client;
  }
}
