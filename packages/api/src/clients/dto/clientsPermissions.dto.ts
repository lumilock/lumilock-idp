// clientsFull.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { Client } from '../../model/clients.entity';

export class ClientsPermissionsDTO implements Readonly<ClientsPermissionsDTO> {
  @ApiProperty({ required: true })
  @IsString({ each: true })
  permissions: string[];

  public static from(dto: Partial<ClientsPermissionsDTO>) {
    const client = new ClientsPermissionsDTO();
    client.permissions = dto.permissions;
    return client;
  }
  public static fromEntity(entity: Client) {
    return this.from({
      permissions: entity.permissions,
    });
  }
}
