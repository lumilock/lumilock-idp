// usersLinks.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { User } from '../../model/users.entity';

export class UsersLinksDTO implements Readonly<UsersLinksDTO> {
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

  public static from(dto: Partial<UsersLinksDTO>): UsersLinksDTO {
    const user = new UsersLinksDTO();
    user.profile = dto?.profile;
    user.website = dto?.website;
    return user;
  }

  public static fromEntity(entity: User) {
    return this.from({
      profile: entity?.profile,
      website: entity?.website,
    });
  }

  public toEntity() {
    const user = new User();
    user.profile = this?.profile;
    user.website = this?.website;
    return user;
  }
}
