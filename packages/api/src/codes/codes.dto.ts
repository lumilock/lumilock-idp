// item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
// import { Type } from 'class-transformer';
import {
  IsUUID,
  IsString,
  ValidateNested,
  IsJSON,
  IsEnum,
} from 'class-validator';
import { LightenClientsDTO } from 'src/clients/lightenClients.dto';
import { Code, CodeScope } from '../model/codes.entity';
import { ClientsDTO } from '../clients/clients.dto';
import { LightenUsersDTO } from '../users/LightenUsers.dto';

export class CodesDTO implements Readonly<CodesDTO> {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @IsString()
  @ApiProperty({ required: true })
  code: string;

  @IsEnum(CodeScope)
  @ApiProperty({ required: false, enum: CodeScope, default: CodeScope.OPENID })
  scope: CodeScope;

  @IsJSON()
  @ValidateNested()
  @ApiProperty({ required: true })
  client: ClientsDTO | LightenClientsDTO;

  @IsJSON()
  @ValidateNested()
  @ApiProperty({ required: true })
  user: LightenUsersDTO;

  public static from(dto: Partial<CodesDTO>) {
    const code = new CodesDTO();
    code.id = dto.id;
    code.code = dto.code;
    code.scope = dto.scope;
    code.client = dto.client;
    code.user = dto.user;
    return code;
  }

  public static fromEntity(entity: Code) {
    return this.from({
      id: entity.id,
      code: entity.code,
      scope: entity.scope,
      client: ClientsDTO.fromEntity(entity.client),
      user: LightenUsersDTO.fromEntity(entity.user),
    });
  }

  public toEntity() {
    const code = new CodesDTO();
    code.id = this.id;
    code.code = this.code;
    code.scope = this.scope;
    code.client = this.client;
    code.user = this.user;
    return code;
  }
}
