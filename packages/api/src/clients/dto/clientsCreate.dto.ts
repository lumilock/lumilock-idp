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

export class ClientsCreateDTO implements Readonly<ClientsCreateDTO> {
  @ApiProperty({ required: true })
  @IsOptional()
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  clientName: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  secret: string;

  @ApiProperty({ required: true })
  @IsString({ each: true })
  redirectUris: string[];

  @ApiProperty({
    required: false,
    enum: ApplicationType,
    default: ApplicationType.WEB,
  })
  @IsOptional()
  @IsEnum(ApplicationType)
  applicationType: ApplicationType;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  hide: boolean;

  public static from(dto: Partial<ClientsCreateDTO>) {
    const client = new ClientsCreateDTO();
    client.id = dto.id;
    client.clientName = dto.clientName;
    client.secret = dto.secret;
    client.redirectUris = dto.redirectUris;
    client.applicationType = dto.applicationType;
    client.hide = dto.hide;
    return client;
  }

  public static fromEntity(entity: Client) {
    return this.from({
      id: entity.id,
      clientName: entity.clientName,
      secret: entity.secret,
      redirectUris: entity.redirectUris,
      applicationType: entity.applicationType,
      hide: entity.hide,
    });
  }

  public toEntity() {
    const client = new Client();
    client.id = this.id;
    client.clientName = this.clientName;
    client.secret = this.secret;
    client.redirectUris = this.redirectUris;
    client.applicationType = this.applicationType;
    client.hide = this.hide;
    return client;
  }
}
