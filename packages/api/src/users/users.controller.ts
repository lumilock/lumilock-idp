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
  UsersGeoDataDTO,
  UsersIdentityDTO,
  UsersLightDTO,
  UsersLinksDTO,
  UsersPatchPersoInfoDTO,
  UsersPermissionsDTO,
  UsersStatesDataDTO,
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
  @SetMetadata('permissions', ['users'])
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
   * @param {string} userId id of the user
   * @returns {UsersPatchPersoInfoDTO | undefined} the updated and formatted personnal information or nothing
   */
  @UseGuards(AuthenticatedGuard)
  @SetMetadata('permissions', ['users'])
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

  /**
   * Method used to patch identity information of a specific user
   * @param {UsersIdentityDTO} userIdentity new identity information to update
   * @param {string} userId id of the user
   * @returns {UsersIdentityDTO | undefined} the updated and formatted identity information or nothing
   */
  @UseGuards(AuthenticatedGuard)
  @SetMetadata('permissions', ['users'])
  @UseGuards(PermissionsGuard)
  @Patch(':id/identity')
  public async patchIdentity(
    @Param('id') userId: string,
    @Body() userIdentity: UsersIdentityDTO,
  ): Promise<UsersIdentityDTO | undefined> {
    // Get users
    const {
      email: cEmail,
      emailVerified: cEmailVerified,
      phoneNumber: cPhoneNumber,
      phoneNumberVerified: cPhoneNumberVerified,
    } = await this.serv.findById(userId);

    // Formatted current identity data
    const formattedIdentity = UsersIdentityDTO.from({
      email: userIdentity?.email,
      emailVerified: userIdentity?.email !== cEmail ? false : cEmailVerified,
      phoneNumber: userIdentity?.phoneNumber,
      phoneNumberVerified:
        userIdentity?.phoneNumber !== cPhoneNumber
          ? false
          : cPhoneNumberVerified,
    });

    // Patch in db
    const patchedUserIdentity = await this.serv.patchIdentity(
      userId,
      formattedIdentity,
    );

    if (patchedUserIdentity && typeof patchedUserIdentity === 'object') {
      return patchedUserIdentity;
    }
    return undefined;
  }

  /**
   * Method used to patch external links profile and website of a specific user
   * @param {UsersLinksDTO} userLinks external links profile and website to update
   * @param {string} userId id of the user
   * @returns {UsersLinksDTO | undefined} determine if external links profile and website has been patched
   */
  @UseGuards(AuthenticatedGuard)
  @SetMetadata('permissions', ['users'])
  @UseGuards(PermissionsGuard)
  @Patch(':id/links')
  public async patchLinks(
    @Param('id') userId: string,
    @Body() userLinks: UsersLinksDTO,
  ): Promise<UsersLinksDTO | undefined> {
    // Patch in db
    const patchedUserLinks = await this.serv.patchLinks(userId, userLinks);

    if (patchedUserLinks && typeof patchedUserLinks === 'object') {
      return patchedUserLinks;
    }
    return undefined;
  }

  /**
   * Method used to patch geographique data zoneinfo and locale of a specific user
   * @param {UsersGeoDataDTO} userGeoData geographique data zoneinfo and locale to update
   * @param {string} userId id of the user
   * @returns {UsersGeoDataDTO | undefined} determine if geographique data zoneinfo and locale has been patched
   */
  @UseGuards(AuthenticatedGuard)
  @SetMetadata('permissions', ['users'])
  @UseGuards(PermissionsGuard)
  @Patch(':id/geo-data')
  public async patchGeoData(
    @Param('id') userId: string,
    @Body() userGeoData: UsersGeoDataDTO,
  ): Promise<UsersGeoDataDTO | undefined> {
    // Patch in db
    const patchedGeoData = await this.serv.patchGeoData(userId, userGeoData);

    if (patchedGeoData && typeof patchedGeoData === 'object') {
      return patchedGeoData;
    }

    return undefined;
  }

  /**
   * Method used to patch states data isArchived and isActive of a specific user
   * @param {UsersStatesDataDTO} userStatesData states data isArchived and isActive to update
   * @param {string} userId id of the user
   * @returns {UsersStatesDataDTO | undefined} determine if states data isArchived and isActive has been patched
   */
  @UseGuards(AuthenticatedGuard)
  @SetMetadata('permissions', ['users'])
  @UseGuards(PermissionsGuard)
  @Patch(':id/states')
  public async patchStatesData(
    @Param('id') userId: string,
    @Body() userStatesData: UsersStatesDataDTO,
  ): Promise<UsersStatesDataDTO | undefined> {
    // Patch in db
    const patchedStatesData = await this.serv.patchStatesData(
      userId,
      userStatesData,
    );

    if (patchedStatesData && typeof patchedStatesData === 'object') {
      return patchedStatesData;
    }

    return undefined;
  }

  /**
   * Method used to retrieve permissions of a specific users for all clients
   * @param {string} userId id of the user
   * @returns {UsersStatesDataDTO | undefined} permissions if founded
   */
  @UseGuards(AuthenticatedGuard)
  @SetMetadata('permissions', ['users'])
  @UseGuards(PermissionsGuard)
  @Get(':id/permissions')
  public async getPermissions(
    @Param('id') userId: string,
  ): Promise<UsersPermissionsDTO[] | undefined> {
    // Patch in db
    const userPermissions = await this.serv.getPermissions(userId);

    if (
      userPermissions &&
      Array.isArray(userPermissions) &&
      userPermissions?.length > 0 &&
      typeof userPermissions?.[0] === 'object'
    ) {
      return userPermissions;
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
