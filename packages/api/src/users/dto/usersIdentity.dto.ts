// item.dto?.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsBoolean } from 'class-validator';

import { User } from '../../model/users.entity';

export class UsersIdentityDTO implements Readonly<UsersIdentityDTO> {
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

  public static from(dto: Partial<UsersIdentityDTO>): UsersIdentityDTO {
    const user = new UsersIdentityDTO();
    user.email = dto?.email;
    user.emailVerified = dto?.emailVerified;
    user.phoneNumber = dto?.phoneNumber;
    user.phoneNumberVerified = dto?.phoneNumberVerified;
    return user;
  }

  public static fromEntity(entity: User) {
    return this.from({
      email: entity?.email,
      emailVerified: entity?.emailVerified,
      phoneNumber: entity?.phoneNumber,
      phoneNumberVerified: entity?.phoneNumberVerified,
    });
  }

  public toEntity() {
    const user = new User();
    user.email = this?.email;
    user.emailVerified = this?.emailVerified;
    user.phoneNumber = this?.phoneNumber;
    user.phoneNumberVerified = this?.phoneNumberVerified;
    return user;
  }
}
