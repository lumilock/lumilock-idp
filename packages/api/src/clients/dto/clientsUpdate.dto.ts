// clientsFull.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { ApplicationType, Client } from '../../model/clients.entity';

export class ClientsUpdateDTO implements Readonly<ClientsUpdateDTO> {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  clientName: string;

  @ApiProperty({ required: false })
  @IsString()
  appUrl: string;

  @ApiProperty({ required: true })
  @IsString({ each: true })
  redirectUris: string[];

  @ApiProperty({ required: true })
  @IsString({ each: true })
  permissions: string[];

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  logoUri: string;

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

  public static from(dto: Partial<ClientsUpdateDTO>) {
    const client = new ClientsUpdateDTO();
    client.id = dto.id;
    client.clientName = dto.clientName;
    client.appUrl = dto.appUrl;
    client.redirectUris = dto.redirectUris;
    client.permissions = dto.permissions;
    client.applicationType = dto.applicationType;
    client.hide = dto.hide;
    client.logoUri = dto.logoUri;
    client.isActive = dto.isActive;
    client.isArchived = dto.isArchived;
    return client;
  }

  public static fromEntity(entity: Client) {
    return this.from({
      id: entity.id,
      clientName: entity.clientName,
      appUrl: entity.appUrl,
      redirectUris: entity.redirectUris,
      permissions: entity.permissions,
      applicationType: entity.applicationType,
      hide: entity.hide,
      logoUri: entity.logoUri,
      isActive: entity.isActive,
      isArchived: entity.isArchived,
    });
  }

  public toEntity() {
    const client = new Client();
    client.id = this.id;
    client.clientName = this.clientName;
    client.appUrl = this.appUrl;
    client.redirectUris = this.redirectUris;
    client.permissions = this.permissions;
    client.applicationType = this.applicationType;
    client.hide = this.hide;
    client.logoUri = this.logoUri;
    client.isActive = this.isActive;
    client.isArchived = this.isArchived;
    return client;
  }
}
