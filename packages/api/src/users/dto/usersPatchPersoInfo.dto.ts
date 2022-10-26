// item.dto?.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsEnum, IsDate, Matches, IsOptional } from 'class-validator';

import { User, UserGender } from '../../model/users.entity';

export class UsersPatchPersoInfoDTO
  implements Readonly<UsersPatchPersoInfoDTO>
{
  /**
   * The full name of the end-user, with optional language tag
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  /**
   * The given or first name of the end-user
   */
  @ApiProperty({ required: true })
  @IsString()
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿŸœ -]*$/i, {
    message: 'special char are not allowed',
  })
  givenName: string;

  /**
   * The surname(s) or last name(s) of the end-user
   */
  @ApiProperty({ required: true })
  @IsString()
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿŸœ -]*$/i, {
    message: 'special char are not allowed',
  })
  familyName: string;

  /**
   * The middle name of the end-user
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-zÀ-ÖØ-öø-ÿŸœ -]*$/i, {
    message: 'special char are not allowed',
  })
  middleName: string;

  /**
   * The casual name of the end-user
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  nickname: string;

  /**
   * The username by which the end-user wants to be referred to at the client application.
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  preferredUsername: string;

  /**
   * The end-user's gender.
   */
  @ApiProperty({ required: false, enum: UserGender, default: UserGender.OTHER })
  @IsOptional()
  @IsEnum(UserGender)
  gender: UserGender;

  /**
   * The end-user's birthday, represented in ISO 8601:2004 YYYY-MM-DD format.
   * The year may be 0000, indicating that it is omitted. To represent only the year, YYYY format is allowed.
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthdate: Date;

  public static from(
    dto: Partial<UsersPatchPersoInfoDTO>,
  ): UsersPatchPersoInfoDTO {
    const user = new UsersPatchPersoInfoDTO();
    user.name = [dto?.givenName, dto?.middleName, dto?.familyName]
      .join(' ')
      .replace(/ +(?= )/g, '')
      .trim();
    user.givenName = dto?.givenName;
    user.familyName = dto?.familyName;
    user.middleName = dto?.middleName;
    user.nickname = dto?.nickname;
    user.preferredUsername = dto?.preferredUsername;
    user.gender = dto?.gender;
    user.birthdate = dto?.birthdate;
    return user;
  }

  public static fromEntity(entity: User) {
    return this.from({
      givenName: entity?.givenName,
      familyName: entity?.familyName,
      middleName: entity?.middleName,
      nickname: entity?.nickname,
      preferredUsername: entity?.preferredUsername,
      gender: entity?.gender,
      birthdate: entity?.birthdate,
    });
  }

  public toEntity() {
    const user = new User();
    user.name = [this?.givenName, this?.middleName, this?.familyName]
      .join(' ')
      .replace(/ +(?= )/g, '')
      .trim();
    user.givenName = this?.givenName;
    user.familyName = this?.familyName;
    user.middleName = this?.middleName;
    user.nickname = this?.nickname;
    user.preferredUsername = this?.preferredUsername;
    user.gender = this?.gender;
    user.birthdate = this?.birthdate;
    return user;
  }
}
