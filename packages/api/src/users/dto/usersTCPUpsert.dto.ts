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
  IsJSON,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { hashPassword, noTildes } from '../../utils';
import { User, UserGender } from '../../model/users.entity';
import { AddressesDTO } from '../../addresses/addresses.dto';

export class UsersTCPUpsertDTO implements Readonly<UsersTCPUpsertDTO> {
  /**
   * A unique id string used to login in the end-user
   */
  @ApiProperty({ required: true })
  @IsOptional() // optional when create a new one
  @IsString()
  uniqueId: string;

  @ApiProperty({ required: true })
  @IsOptional() // optional when create a new one
  @IsUUID()
  id: string;

  /**
   * A unique id string used to login in the end-user
   */
  @ApiProperty({ required: true })
  @IsOptional() // optional when create a new one
  @IsString()
  login: string;

  /**
   * Password used to login in the end-user
   */
  @ApiProperty({ required: false })
  @IsOptional()
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

  /**
   * True if the end-user's telephone number has been verified, else false.
   */
  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  phoneNumberVerified: boolean;

  /**
   * A JSON object describing the end-user's preferred postal address.
   */
  @ApiProperty({ required: false })
  @IsOptional()
  @IsJSON()
  @ValidateNested()
  addresses: AddressesDTO[];

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

  public static from(dto: Partial<UsersTCPUpsertDTO>): UsersTCPUpsertDTO {
    const user = new UsersTCPUpsertDTO();
    typeof dto.uniqueId !== 'undefined'
      ? (user.uniqueId = dto.uniqueId)
      : '$undefined$';
    user.login =
      dto.login ||
      noTildes([dto?.givenName, dto.familyName]) // no special char
        ?.join('.')
        ?.toLowerCase(); // all lowercase // removing multiple space
    typeof dto.password !== 'undefined'
      ? (user.password = dto.password)
      : '$undefined$';
    user.name = [dto.givenName, dto.middleName, dto.familyName]
      .join(' ')
      .replace(/ +(?= )/g, '')
      .trim();
    typeof dto.givenName !== 'undefined'
      ? (user.givenName = dto.givenName)
      : '$undefined$';
    typeof dto.familyName !== 'undefined'
      ? (user.familyName = dto.familyName)
      : '$undefined$';
    typeof dto.middleName !== 'undefined'
      ? (user.middleName = dto.middleName)
      : '$undefined$';
    typeof dto.nickname !== 'undefined'
      ? (user.nickname = dto.nickname)
      : '$undefined$';
    typeof dto.preferredUsername !== 'undefined'
      ? (user.preferredUsername = dto.preferredUsername)
      : '$undefined$';
    typeof dto.profile !== 'undefined'
      ? (user.profile = dto.profile)
      : '$undefined$';
    typeof dto.picture !== 'undefined'
      ? (user.picture = dto.picture)
      : '$undefined$';
    typeof dto.website !== 'undefined'
      ? (user.website = dto.website)
      : '$undefined$';
    typeof dto.email !== 'undefined' ? (user.email = dto.email) : '$undefined$';
    typeof dto.emailVerified !== 'undefined'
      ? (user.emailVerified = dto.emailVerified)
      : '$undefined$';
    typeof dto.gender !== 'undefined'
      ? (user.gender = dto.gender)
      : '$undefined$';
    typeof dto.birthdate !== 'undefined'
      ? (user.birthdate = dto.birthdate)
      : '$undefined$';
    typeof dto.zoneinfo !== 'undefined'
      ? (user.zoneinfo = dto.zoneinfo)
      : '$undefined$';
    typeof dto.locale !== 'undefined'
      ? (user.locale = dto.locale)
      : '$undefined$';
    typeof dto.phoneNumber !== 'undefined'
      ? (user.phoneNumber = dto.phoneNumber)
      : '$undefined$';
    typeof dto.phoneNumberVerified !== 'undefined'
      ? (user.phoneNumberVerified = dto.phoneNumberVerified)
      : '$undefined$';
    typeof dto.addresses !== 'undefined'
      ? (user.addresses = dto.addresses)
      : '$undefined$';
    typeof dto.isActive !== 'undefined'
      ? (user.isActive = dto.isActive)
      : '$undefined$';
    typeof dto.isArchived !== 'undefined'
      ? (user.isArchived = dto.isArchived)
      : '$undefined$';
    return user;
  }

  public static checking(value: any, defaultValue = '$undefined$'): any {
    return typeof value !== 'undefined' ? value : defaultValue;
  }

  public static format(userDTO: Partial<UsersTCPUpsertDTO>): any[] {
    const user = [];
    user.push(this.checking(userDTO.uniqueId));
    user.push(this.checking(userDTO.id, null));
    user.push(this.checking(userDTO.login));
    user.push(this.checking(userDTO.password));
    user.push(this.checking(userDTO.name));
    user.push(this.checking(userDTO.givenName));
    user.push(this.checking(userDTO.familyName));
    user.push(this.checking(userDTO.middleName));
    user.push(this.checking(userDTO.nickname));
    user.push(this.checking(userDTO.preferredUsername));
    user.push(this.checking(userDTO.profile));
    user.push(this.checking(userDTO.picture));
    user.push(this.checking(userDTO.website));
    user.push(this.checking(userDTO.email));
    user.push(this.checking(userDTO.emailVerified));
    user.push(this.checking(userDTO.gender));
    user.push(this.checking(userDTO.birthdate));
    user.push(this.checking(userDTO.zoneinfo));
    user.push(this.checking(userDTO.locale));
    user.push(this.checking(userDTO.phoneNumber));
    user.push(this.checking(userDTO.phoneNumberVerified));
    user.push(this.checking(userDTO.isActive));
    user.push(this.checking(userDTO.isArchived));
    return user;
  }

  /**
   * Generate a dictionnary of 3 keys:
   * - usersDTO the user formatted array
   * - ids an array of all user subjectId (not all users has a subjectId)
   * - logins an object {login: count} that count the repetition of each login
   * @param dto array of object to format to UsersTCPUpsertDTO
   * @returns dictionnary of 3 keys
   */
  public static fromMultiple(dto: Partial<UsersTCPUpsertDTO[]>): {
    usersArray: any[];
    addressesArray: any[];
  } {
    return dto.reduce(
      (accu, { password, ...rest }) => {
        // Formatting the user
        const user = this.from({
          ...(password ? { password: hashPassword(password) } : {}),
          ...rest,
        });
        const uAdresses =
          Array.isArray(user?.addresses) && user?.addresses?.length > 0
            ? user?.addresses
            : [];
        // store all users
        const usersArray = [...accu?.usersArray, this.format(user)];
        // retrieve all ids
        const addressesArray = [
          ...accu?.addressesArray,
          ...uAdresses.map((a) => addressesArray.format(a)),
        ];
        return { usersArray, addressesArray };
      },
      {
        usersArray: [],
        addressesArray: [
          [null, null, null, null, null, null, null, null, null, null, null],
        ],
      },
    );
  }

  public static fromEntity(entity: User, uniqueId) {
    return this.from({
      uniqueId,
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
      email: entity.email || null,
      emailVerified: entity.emailVerified,
      gender: entity.gender,
      birthdate: entity.birthdate,
      zoneinfo: entity.zoneinfo,
      locale: entity.locale,
      phoneNumber: entity.phoneNumber || null,
      phoneNumberVerified: entity.phoneNumberVerified,
      addresses: AddressesDTO.fromEntities(entity.addresses),
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
