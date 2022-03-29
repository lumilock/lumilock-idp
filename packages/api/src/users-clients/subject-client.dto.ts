// item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsUUID, IsString } from 'class-validator';
import { UserRole, UsersClients } from '../model/users_clients.entity';

export class SubjectClientDTO implements Readonly<SubjectClientDTO> {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @IsEnum(UserRole)
  @ApiProperty({ required: false, enum: UserRole, default: UserRole.NONE })
  role: UserRole;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  authorization: boolean;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  favorite: boolean;

  @ApiProperty({ required: true })
  @IsString({ each: true })
  permissions: string[];

  @ApiProperty({ required: true })
  @IsUUID()
  client_id: string;

  public static from(dto: Partial<SubjectClientDTO>) {
    const userClient = new SubjectClientDTO();
    userClient.id = dto.id;
    userClient.role = dto.role;
    userClient.authorization = dto.authorization;
    userClient.favorite = dto.favorite;
    userClient.permissions = dto.permissions;
    userClient.client_id = dto.client_id;
    return userClient;
  }

  public static fromEntity(entity: UsersClients) {
    return this.from({
      id: entity.id,
      role: entity.role,
      authorization: entity.authorization,
      favorite: entity.favorite,
      permissions: entity.permissions,
      client_id: entity.clientId,
    });
  }

  public static fromEntities(entities: UsersClients[]): SubjectClientDTO[] {
    return entities?.map((entity) =>
      this.from({
        id: entity.id,
        role: entity.role,
        authorization: entity.authorization,
        favorite: entity.favorite,
        permissions: entity.permissions,
        client_id: entity.clientId,
      }),
    );
  }

  public toEntity() {
    const userClient = new UsersClients();
    userClient.id = this.id;
    userClient.role = this.role;
    userClient.authorization = this.authorization;
    userClient.favorite = this.favorite;
    userClient.permissions = this.permissions;
    userClient.clientId = this.client_id;
    return userClient;
  }
}
