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
  callbackUrl: string;

  @ApiProperty({ required: false })
  @IsString()
  clientPicture: string;

  public static from(dto: Partial<ClientsDTO>, light = true) {
    const client = new ClientsDTO();
    client.id = dto.id;
    client.name = dto.name;
    if (!light) client.secret = dto.secret;
    client.callbackUrl = dto.callbackUrl;
    client.clientPicture = dto.clientPicture;
    return client;
  }

  public static fromEntity(entity: Client, light = true) {
    return this.from(
      {
        id: entity.id,
        name: entity.name,
        ...(!light ? { secret: entity.secret } : {}),
        callbackUrl: entity.callbackUrl,
        clientPicture: entity.clientPicture,
      },
      light,
    );
  }

  public toEntity(light = true) {
    const client = new Client();
    client.id = this.id;
    client.name = this.name;
    if (!light) client.secret = this.secret;
    client.callbackUrl = this.callbackUrl;
    client.clientPicture = this.clientPicture;
    return client;
  }
}
