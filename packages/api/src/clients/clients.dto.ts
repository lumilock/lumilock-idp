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
  clientName: string;

  @ApiProperty({ required: true })
  @IsString()
  secret: string;

  @ApiProperty({ required: true })
  @IsString({ each: true })
  redirectUris: string[];

  @ApiProperty({ required: false })
  @IsString()
  logoUri: string;

  public static from(dto: Partial<ClientsDTO>, light = true) {
    const client = new ClientsDTO();
    client.id = dto.id;
    client.clientName = dto.clientName;
    if (!light) client.secret = dto.secret;
    client.redirectUris = dto.redirectUris;
    client.logoUri = dto.logoUri;
    return client;
  }

  public static fromEntity(entity: Client, light = true) {
    return this.from(
      {
        id: entity.id,
        clientName: entity.clientName,
        ...(!light ? { secret: entity.secret } : {}),
        redirectUris: entity.redirectUris,
        logoUri: entity.logoUri,
      },
      light,
    );
  }

  public toEntity(light = true) {
    const client = new Client();
    client.id = this.id;
    client.clientName = this.clientName;
    if (!light) client.secret = this.secret;
    client.redirectUris = this.redirectUris;
    client.logoUri = this.logoUri;
    return client;
  }
}
