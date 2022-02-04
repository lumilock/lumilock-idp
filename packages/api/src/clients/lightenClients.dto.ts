// item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { Client } from '../model/clients.entity';

export class LightenClientsDTO implements Readonly<LightenClientsDTO> {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  callbackUrl: string;

  @ApiProperty({ required: false })
  @IsString()
  clientPicture: string;

  public static from(dto: Partial<LightenClientsDTO>) {
    const client = new LightenClientsDTO();
    client.id = dto.id;
    client.name = dto.name;
    client.callbackUrl = dto.callbackUrl;
    client.clientPicture = dto.clientPicture;
    return client;
  }

  public static fromEntity(entity: Client) {
    return this.from({
      id: entity.id,
      name: entity.name,
      callbackUrl: entity.callback_url,
      clientPicture: entity.client_picture,
    });
  }

  public toEntity() {
    const client = new Client();
    client.id = this.id;
    client.name = this.name;
    client.callback_url = this.callbackUrl;
    client.client_picture = this.clientPicture;
    return client;
  }
}
