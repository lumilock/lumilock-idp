// item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID } from 'class-validator';
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

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  hide: boolean;

  public static from(dto: Partial<ClientsDTO>, light = true) {
    const client = new ClientsDTO();
    client.id = dto.id;
    client.clientName = dto.clientName;
    if (!light) client.secret = dto.secret;
    client.appUrl = dto.appUrl;
    client.redirectUris = dto.redirectUris;
    client.permissions = dto.permissions;
    client.logoUri = dto.logoUri;
    client.hide = dto.hide;
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
        hide: entity.hide,
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
    client.hide = this.hide;
    return client;
  }
}
