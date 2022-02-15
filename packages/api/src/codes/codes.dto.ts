// codes.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsString,
  ValidateNested,
  IsJSON,
  IsEnum,
  IsDate,
} from 'class-validator';
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
  client: ClientsDTO;

  @IsJSON()
  @ValidateNested()
  @ApiProperty({ required: true })
  user: LightenUsersDTO;

  @IsDate()
  @ApiProperty({ required: false })
  createDateTime: Date;

  public static from(dto: Partial<CodesDTO>) {
    const code = new CodesDTO();
    code.id = dto.id;
    code.code = dto.code;
    code.scope = dto.scope;
    code.client = dto.client;
    code.user = dto.user;
    code.createDateTime = dto.createDateTime;
    return code;
  }

  public static fromEntity(entity: Code) {
    return this.from({
      id: entity.id,
      code: entity.code,
      scope: entity.scope,
      client: ClientsDTO.fromEntity(entity.client),
      user: LightenUsersDTO.fromEntity(entity.user),
      createDateTime: entity.createDateTime,
    });
  }

  public toEntity() {
    const code = new CodesDTO();
    code.id = this.id;
    code.code = this.code;
    code.scope = this.scope;
    code.client = this.client;
    code.user = this.user;
    code.user = this.user;
    code.createDateTime = this.createDateTime;
    return code;
  }
}
