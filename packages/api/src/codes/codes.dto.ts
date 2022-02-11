// item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
// import { Type } from 'class-transformer';
import { IsUUID, IsString, ValidateNested, IsJSON } from 'class-validator';
import { LightenClientsDTO } from 'src/clients/lightenClients.dto';
import { Code } from '../model/codes.entity';
import { ClientsDTO } from '../clients/clients.dto';

export class CodesDTO implements Readonly<CodesDTO> {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @IsString()
  @ApiProperty({ required: true })
  code: string;

  @IsJSON()
  @ValidateNested()
  // @Type(() => (ClientsDTO | LightenClientsDTO))
  @ApiProperty({ required: true })
  client: ClientsDTO | LightenClientsDTO;

  public static from(dto: Partial<CodesDTO>) {
    const code = new CodesDTO();
    code.id = dto.id;
    code.code = dto.code;
    code.client = dto.client;
    return code;
  }

  public static fromEntity(entity: Code) {
    return this.from({
      id: entity.id,
      code: entity.code,
      client: ClientsDTO.fromEntity(entity.client),
    });
  }

  public toEntity() {
    const code = new CodesDTO();
    code.id = this.id;
    code.code = this.code;
    code.client = this.client;
    return code;
  }
}
