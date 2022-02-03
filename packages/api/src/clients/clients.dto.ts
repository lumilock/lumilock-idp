// item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';
import { Client } from '../model/clients.entity';

export class ClientsDTO implements Readonly<ClientsDTO> {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  // @OneToMany(() => Code, (code) => code.client)
  // codes: Code[];

  @ApiProperty({ required: true })
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  secret: string;

  @ApiProperty({ required: true })
  @IsString()
  callback_url: string;

  @ApiProperty({ required: false })
  @IsString()
  client_picture: string;

  public static from(dto: Partial<ClientsDTO>) {
    const client = new ClientsDTO();
    client.id = dto.id;
    client.name = dto.name;
    client.secret = dto.secret;
    client.callback_url = dto.callback_url;
    client.client_picture = dto.client_picture;
    return client;
  }

  public static fromEntity(entity: Client) {
    return this.from({
      id: entity.id,
      name: entity.name,
      secret: entity.secret,
      callback_url: entity.callback_url,
      client_picture: entity.client_picture,
    });
  }

  public toEntity() {
    const client = new Client();
    client.id = this.id;
    client.name = this.name;
    client.secret = this.secret;
    client.callback_url = this.callback_url;
    client.client_picture = this.client_picture;
    return client;
  }
}
