// userPermissions.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';
import { Column } from 'typeorm';

import { UserRole } from '../../model/users_clients.entity';

export class UsersPermissionsDTO implements Readonly<UsersPermissionsDTO> {
  /**
   * Id of the client
   */
  @ApiProperty({ required: true })
  @IsOptional() // optional when create a new one
  @IsUUID()
  id: string;

  /**
   * Name of the client
   */
  @ApiProperty({ required: true })
  @IsString()
  clientName: string;

  @Column({
    name: 'logo_uri',
    type: 'varchar',
    nullable: true,
    length: 300,
  })
  logoUri: string;

  /**
   * List of possibles permissions of the client
   */
  @ApiProperty({ required: true })
  @IsString({ each: true })
  permissions: string[];

  /**
   * Id of the user
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  userId: string;

  /**
   * Name user
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userName: string;

  /**
   * Id of the pivot table users_clients
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  usersClientsId: string;

  /**
   * List of possibles Roles of relation users_clients (none, admin, user, guest)
   */
  @IsEnum(UserRole)
  @ApiProperty({ required: false, enum: UserRole, default: UserRole.NONE })
  @IsOptional()
  usersClientsRole: UserRole;

  /**
   * All permissions according to a user for this client
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ each: true })
  usersClientsPermissions: string[];

  public static from(dto: Partial<UsersPermissionsDTO>): UsersPermissionsDTO {
    const permissions: string[] = dto?.permissions?.toString()?.split(',');
    const usersClientsPermissions: string[] = dto?.usersClientsPermissions
      ?.toString()
      ?.split(',');
    const userPermissions = new UsersPermissionsDTO();
    userPermissions.id = dto.id;
    userPermissions.clientName = dto.clientName;
    userPermissions.permissions = permissions;
    userPermissions.logoUri = dto.logoUri;
    userPermissions.userId = dto.userId;
    userPermissions.userName = dto.userName;
    userPermissions.usersClientsId = dto.usersClientsId;
    userPermissions.usersClientsRole = dto.usersClientsRole;
    userPermissions.usersClientsPermissions = usersClientsPermissions;
    return userPermissions;
  }
}
