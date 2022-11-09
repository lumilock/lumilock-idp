// item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsOptional } from 'class-validator';

import { User, UserGender } from '../../model/users.entity';

export class UsersLightDTO implements Readonly<UsersLightDTO> {
  @ApiProperty({ required: true })
  @IsOptional() // optional when create a new one
  @IsUUID()
  id: string;

  /**
   * A unique id string used to login in the end-user
   */
  @ApiProperty({ required: true })
  @IsString()
  login: string;

  /**
   * The full name of the end-user, with optional language tag
   */
  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  name: string;

  /**
   * The URL of the profile picture for the end-user
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  picture: string;

  /**
   * The end-user's gender.
   */
  @ApiProperty({ required: false, enum: UserGender, default: UserGender.OTHER })
  @IsOptional()
  @IsEnum(UserGender)
  gender: UserGender;

  /**
   * City or locality component.
   */
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  locality: string;

  public static from(dto: Partial<UsersLightDTO>): UsersLightDTO {
    const user = new UsersLightDTO();
    user.id = dto.id;
    user.login = dto.login;
    user.name = dto.name;
    user.picture = dto.picture;
    user.gender = dto.gender;
    user.locality = dto.locality;
    return user;
  }

  public static fromEntity(entity: User) {
    return this.from({
      id: entity.id,
      login: entity.login,
      name: entity.name,
      picture: entity.picture,
      gender: entity.gender,
      locality: [
        entity.addresses?.[0]?.locality,
        entity.addresses?.[0]?.country,
      ]
        .filter((c) => !!c && c?.trim() !== '')
        .join(', ')
        .trim(),
    });
  }
}
