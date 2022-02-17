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

  public static from(dto: Partial<ClientsDTO>) {
    const client = new ClientsDTO();
    client.id = dto.id;
    client.name = dto.name;
    client.secret = dto.secret;
    client.callbackUrl = dto.callbackUrl;
    client.clientPicture = dto.clientPicture;
    return client;
  }

  public static fromEntity(entity: Client) {
    return this.from({
      id: entity.id,
      name: entity.name,
      secret: entity.secret,
      callbackUrl: entity.callbackUrl,
      clientPicture: entity.clientPicture,
    });
  }

  public toEntity() {
    const client = new Client();
    client.id = this.id;
    client.name = this.name;
    client.secret = this.secret;
    client.callbackUrl = this.callbackUrl;
    client.clientPicture = this.clientPicture;
    return client;
  }
}
