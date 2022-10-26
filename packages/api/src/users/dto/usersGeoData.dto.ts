// usersLinks.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { User } from '../../model/users.entity';

export class UsersGeoDataDTO implements Readonly<UsersGeoDataDTO> {
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

  public static from(dto: Partial<UsersGeoDataDTO>): UsersGeoDataDTO {
    const user = new UsersGeoDataDTO();
    user.zoneinfo = dto?.zoneinfo;
    user.locale = dto?.locale;
    return user;
  }

  public static fromEntity(entity: User) {
    return this.from({
      zoneinfo: entity?.zoneinfo,
      locale: entity?.locale,
    });
  }

  public toEntity() {
    const user = new User();
    user.zoneinfo = this?.zoneinfo;
    user.locale = this?.locale;
    return user;
  }
}
