// clientsFull.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

import { Client } from '../../model/clients.entity';

export class ClientsLightDTO implements Readonly<ClientsLightDTO> {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  clientName: string;

  @ApiProperty({ required: false })
  @IsString()
  appUrl: string;

  @ApiProperty({ required: false })
  @IsString()
  logoUri: string;

  public static from(dto: Partial<ClientsLightDTO>) {
    const client = new ClientsLightDTO();
    client.id = dto.id;
    client.clientName = dto.clientName;
    client.appUrl = dto.appUrl;
    client.logoUri = dto.logoUri;
    return client;
  }

  public static fromEntity(entity: Client) {
    return this.from({
      id: entity.id,
      clientName: entity.clientName,
      appUrl: entity.appUrl,
      logoUri: entity.logoUri,
    });
  }
}
