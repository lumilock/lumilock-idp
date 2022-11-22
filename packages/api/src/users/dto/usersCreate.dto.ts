// usersCreate.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  MinLength,
  IsBoolean,
  IsEnum,
  IsDate,
  Matches,
  IsOptional,
} from 'class-validator';
import { User, UserGender } from '../../model/users.entity';

export class UsersCreateDTO implements Readonly<UsersCreateDTO> {
  /**
   * Password used to login in the end-user
   */
  @ApiProperty({ required: true })
  @IsString()
  @MinLength(6)
  password: string;

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
   * The URL of the profile page for the end-user
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  profile: string;

  /**
   * The URL of the end-user's web page or blog.
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  website: string;

  /**
   * The end-user's preferred email address.
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email: string;

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

  /**
   * The end-user's time zone, e.g. Europe/Paris or America/Los_Angeles.
   */
  @ApiProperty({ required: false, default: 'UTC' })
  @IsOptional()
  @IsString()
  zoneinfo: string;

  /**
   * The end-user's locale, represented as a BCP47 language tag.
   * This is typically an ISO 639-1 Alpha-2 language code in lowercase and an ISO 3166-1 Alpha-2 country code in uppercase,
   * separated by a dash. For example, en-US or fr-CA.
   */
  @ApiProperty({ required: false, default: 'fr-FR' })
  @IsOptional()
  @IsString()
  locale: string;

  /**
   * The end-user's preferred telephone number, typically in E.164 format,
   * for example +1 (425) 555-1212 or +56 (2) 687 2400.
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phoneNumber: string;

  // ******
  // Base
  // ******
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isArchived: boolean;

  public static from(dto: Partial<UsersCreateDTO>): UsersCreateDTO {
    const user = new UsersCreateDTO();
    user.givenName = dto.givenName;
    user.familyName = dto.familyName;
    user.middleName = dto.middleName;
    user.nickname = dto.nickname;
    user.preferredUsername = dto.preferredUsername;
    user.profile = dto.profile;
    user.website = dto.website;
    user.email = dto.email;
    user.gender = dto.gender;
    user.birthdate = dto.birthdate;
    user.zoneinfo = dto.zoneinfo;
    user.locale = dto.locale;
    user.phoneNumber = dto.phoneNumber;
    user.isActive = dto.isActive;
    user.isArchived = dto.isArchived;
    return user;
  }

  public static fromEntity(entity: User) {
    return this.from({
      givenName: entity.givenName,
      familyName: entity.familyName,
      middleName: entity.middleName,
      nickname: entity.nickname,
      preferredUsername: entity.preferredUsername,
      profile: entity.profile,
      website: entity.website,
      email: entity.email,
      gender: entity.gender,
      birthdate: entity.birthdate,
      zoneinfo: entity.zoneinfo,
      locale: entity.locale,
      phoneNumber: entity.phoneNumber,
      isActive: entity.isActive,
      isArchived: entity.isArchived,
    });
  }
}
