// item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEmail, MinLength } from 'class-validator';
import { User } from '../model/user.entity';

export class UsersDTO implements Readonly<UsersDTO> {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;

  @ApiProperty({ required: true })
  @IsString()
  login: string;

  @ApiProperty({ required: true })
  @IsString()
  first_name: string;

  @ApiProperty({ required: true })
  @IsString()
  last_name: string;

  @ApiProperty({ required: false })
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  profile_picture: string;

  @ApiProperty({ required: true })
  @IsString()
  @MinLength(6)
  password: string;

  public static from(dto: Partial<UsersDTO>) {
    const user = new UsersDTO();
    user.id = dto.id;
    user.login = dto.login;
    user.first_name = dto.first_name;
    user.last_name = dto.last_name;
    user.email = dto.email;
    user.profile_picture = dto.profile_picture;
    user.password = dto.password;
    return user;
  }

  public static fromEntity(entity: User) {
    return this.from({
      id: entity.id,
      login: entity.login,
      first_name: entity.first_name,
      last_name: entity.last_name,
      email: entity.email,
      profile_picture: entity.profile_picture,
      password: entity.password,
    });
  }

  public toEntity() {
    const user = new User();
    user.id = this.id;
    user.login = this.login;
    user.first_name = this.first_name;
    user.last_name = this.last_name;
    user.email = this.email;
    user.profile_picture = this.profile_picture;
    user.password = this.password;
    user.createDateTime = new Date();
    return user;
  }
}
