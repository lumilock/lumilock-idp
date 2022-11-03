// usersCreate.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  IsBoolean,
  IsEnum,
  IsDate,
  Matches,
  IsOptional,
  IsUUID,
} from 'class-validator';

import { noTildes } from '../../utils';
import { User, UserGender } from '../../model/users.entity';

export class UsersCreateFullDTO implements Readonly<UsersCreateFullDTO> {
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
   * Password used to login in the end-user
   */
  @ApiProperty({ required: true })
  @IsString()
  @MinLength(6)
  password: string;

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
   * The URL of the profile page for the end-user
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  profile: string;

  /**
   * The URL of the profile picture for the end-user
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  picture: string;

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
   * True if the end-user's email address has been verified, else false.
   */
  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  emailVerified: boolean;

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

  /**
   * True if the end-user's telephone number has been verified, else false.
   */
  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  phoneNumberVerified: boolean;

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

  public static from(dto: Partial<UsersCreateFullDTO>): UsersCreateFullDTO {
    const user = new UsersCreateFullDTO();
    user.login =
      dto.login ||
      noTildes([dto?.givenName, dto.familyName]) // no special char
        ?.join('.')
        ?.toLowerCase(); // all lowercase // removing multiple space
    user.password = dto.password;
    user.name = [dto.givenName, dto.middleName, dto.familyName]
      .join(' ')
      .replace(/ +(?= )/g, '')
      .trim();
    user.givenName = dto.givenName;
    user.familyName = dto.familyName;
    user.middleName = dto.middleName;
    user.nickname = dto.nickname;
    user.preferredUsername = dto.preferredUsername;
    user.profile = dto.profile;
    user.picture = dto.picture;
    user.website = dto.website;
    user.email = dto.email;
    user.emailVerified = dto.emailVerified;
    user.gender = dto.gender;
    user.birthdate = dto.birthdate;
    user.zoneinfo = dto.zoneinfo;
    user.locale = dto.locale;
    user.phoneNumber = dto.phoneNumber;
    user.phoneNumberVerified = dto.phoneNumberVerified;
    user.isActive = dto.isActive;
    user.isArchived = dto.isArchived;
    return user;
  }

  public static fromEntity(entity: User) {
    return this.from({
      login:
        entity.login ||
        noTildes([entity?.givenName, entity.familyName]) // no special char
          ?.join('.')
          ?.toLowerCase(), // all lowercase // removing multiple space
      password: entity.password,
      name: entity.name,
      givenName: entity.givenName,
      familyName: entity.familyName,
      middleName: entity.middleName,
      nickname: entity.nickname,
      preferredUsername: entity.preferredUsername,
      profile: entity.profile,
      picture: entity.picture,
      website: entity.website,
      email: entity.email,
      emailVerified: entity.emailVerified,
      gender: entity.gender,
      birthdate: entity.birthdate,
      zoneinfo: entity.zoneinfo,
      locale: entity.locale,
      phoneNumber: entity.phoneNumber,
      phoneNumberVerified: entity.phoneNumberVerified,
      isActive: entity.isActive,
      isArchived: entity.isArchived,
    });
  }

  public toEntity() {
    const user = new User();
    user.id = this.id;
    user.login =
      this.login ||
      noTildes([this?.givenName, this.familyName]) // no special char
        ?.join('.')
        ?.toLowerCase(); // all lowercase // removing multiple space
    user.password = this.password;
    user.name = [this.givenName, this.middleName, this.familyName]
      .join(' ')
      .replace(/ +(?= )/g, '')
      .trim();
    user.givenName = this.givenName;
    user.familyName = this.familyName;
    user.middleName = this.middleName;
    user.nickname = this.nickname;
    user.preferredUsername = this.preferredUsername;
    user.profile = this.profile;
    user.picture = this.picture;
    user.website = this.website;
    user.email = this.email;
    user.emailVerified = this.emailVerified;
    user.gender = this.gender;
    user.birthdate = this.birthdate;
    user.zoneinfo = this.zoneinfo;
    user.locale = this.locale;
    user.phoneNumber = this.phoneNumber;
    user.phoneNumberVerified = this.phoneNumberVerified;
    user.isActive = this.isActive;
    user.isArchived = this.isArchived;
    return user;
  }
}
