// item.dto?.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { Match } from '../../common/decorators';

export class UsersPasswordDTO implements Readonly<UsersPasswordDTO> {
  /**
   * Password used to login in the end-user
   */
  @ApiProperty({ required: true })
  @IsString()
  @MinLength(6)
  password: string;

  /**
   * Password used to login in the end-user
   */
  @ApiProperty({ required: true })
  @IsString()
  @MinLength(6)
  newPassword: string;

  /**
   * Password used to login in the end-user
   */
  @ApiProperty({ required: true })
  @Match(UsersPasswordDTO, (userPassword) => userPassword.newPassword)
  @IsString()
  @MinLength(6)
  confirmedPassword: string;

  public static from(dto: Partial<UsersPasswordDTO>): UsersPasswordDTO {
    const user = new UsersPasswordDTO();
    user.password = dto?.password;
    user.newPassword = dto?.newPassword;
    user.confirmedPassword = dto?.confirmedPassword;
    return user;
  }
}
