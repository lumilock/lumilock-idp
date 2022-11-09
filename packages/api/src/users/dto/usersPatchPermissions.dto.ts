// userPermissions.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';

import { UserRole, UsersClients } from '../../model/users_clients.entity';

export class UsersPatchPermissionsDTO
  implements Readonly<UsersPatchPermissionsDTO>
{
  /**
   * user Id
   */
  @ApiProperty({ required: true })
  @IsOptional() // optional when create a new one
  @IsUUID()
  id: string;

  /**
   * Id of the client
   */
  @ApiProperty({ required: true })
  @IsUUID()
  clientId: string;

  /**
   * List of possibles permissions of the user for a client
   */
  @ApiProperty({ required: true })
  @IsString({ each: true })
  permissions: string[];

  /**
   * Role of the user for a client one of (none, admin, user, guest)
   */
  @IsEnum(UserRole)
  @ApiProperty({ required: true, enum: UserRole, default: UserRole.NONE })
  role: UserRole;

  public static from(
    dto: Partial<UsersPatchPermissionsDTO>,
  ): UsersPatchPermissionsDTO {
    const userPermissions = new UsersPatchPermissionsDTO();
    userPermissions.id = dto.id;
    userPermissions.clientId = dto.clientId;
    userPermissions.permissions = dto.permissions;
    userPermissions.role = dto.role;
    return userPermissions;
  }

  public static fromEntity(entity: UsersClients) {
    return this.from({
      id: entity.userId,
      clientId: entity.clientId,
      permissions: entity.permissions,
      role: entity.role,
    });
  }

  public toEntity() {
    const usersClients = new UsersClients();
    usersClients.userId = this?.id;
    usersClients.clientId = this?.clientId;
    usersClients.permissions = this?.permissions;
    usersClients.role = this?.role;
    return usersClients;
  }
}
