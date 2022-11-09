// UsersStatesDataDTO.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

import { User } from '../../model/users.entity';

export class UsersStatesDataDTO implements Readonly<UsersStatesDataDTO> {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isArchived: boolean;

  public static from(dto: Partial<UsersStatesDataDTO>): UsersStatesDataDTO {
    const user = new UsersStatesDataDTO();
    user.isActive = dto?.isActive;
    user.isArchived = dto?.isArchived;
    return user;
  }

  public static fromEntity(entity: User) {
    return this.from({
      isActive: entity?.isActive,
      isArchived: entity?.isArchived,
    });
  }

  public toEntity() {
    const user = new User();
    user.isActive = this?.isActive;
    user.isArchived = this?.isArchived;
    return user;
  }
}
