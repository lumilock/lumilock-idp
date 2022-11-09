// clientsFull.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { ApplicationType, Client } from '../../model/clients.entity';

export class ClientsFullDTO implements Readonly<ClientsFullDTO> {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  clientName: string;

  @ApiProperty({ required: true })
  @IsString()
  secret: string;

  @ApiProperty({ required: false })
  @IsString()
  appUrl: string;

  @ApiProperty({ required: true })
  @IsString({ each: true })
  redirectUris: string[];

  @ApiProperty({ required: true })
  @IsString({ each: true })
  permissions: string[];

  @ApiProperty({ required: false })
  @IsString()
  logoUri: string;

  @ApiProperty({
    required: false,
    enum: ApplicationType,
    default: ApplicationType.WEB,
  })
  @IsOptional()
  @IsEnum(ApplicationType)
  applicationType: ApplicationType;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  hide: boolean;

  // ******
  // Base
  // ******
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isArchived: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  createDateTime: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  lastChangedDateTime: Date;

  public static from(dto: Partial<ClientsFullDTO>, light = true) {
    const client = new ClientsFullDTO();
    client.id = dto.id;
    client.clientName = dto.clientName;
    if (!light) client.secret = dto.secret;
    client.appUrl = dto.appUrl;
    client.redirectUris = dto.redirectUris;
    client.permissions = dto.permissions;
    client.logoUri = dto.logoUri;
    client.applicationType = dto.applicationType;
    client.hide = dto.hide;
    client.isActive = dto.isActive;
    client.isArchived = dto.isArchived;
    client.createDateTime = dto.createDateTime;
    client.lastChangedDateTime = dto.lastChangedDateTime;
    return client;
  }

  public static fromEntity(entity: Client, light = true) {
    return this.from(
      {
        id: entity.id,
        clientName: entity.clientName,
        ...(!light ? { secret: entity.secret } : {}),
        appUrl: entity.appUrl,
        redirectUris: entity.redirectUris,
        permissions: entity.permissions,
        logoUri: entity.logoUri,
        applicationType: entity.applicationType,
        hide: entity.hide,
        isActive: entity.isActive,
        isArchived: entity.isArchived,
        createDateTime: entity.createDateTime,
        lastChangedDateTime: entity.lastChangedDateTime,
      },
      light,
    );
  }

  public toEntity(light = true) {
    const client = new Client();
    client.id = this.id;
    client.clientName = this.clientName;
    if (!light) client.secret = this.secret;
    client.appUrl = this.appUrl;
    client.redirectUris = this.redirectUris;
    client.permissions = this.permissions;
    client.logoUri = this.logoUri;
    client.applicationType = this.applicationType;
    client.hide = this.hide;
    client.isActive = this.isActive;
    client.isArchived = this.isArchived;
    client.createDateTime = this.createDateTime;
    client.lastChangedDateTime = this.lastChangedDateTime;
    return client;
  }
}
