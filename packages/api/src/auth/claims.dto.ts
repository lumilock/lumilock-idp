// authorize.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// https://openid.net/specs/openid-connect-core-1_0.html#IndividualClaimsRequests

export class ClaimsDTO implements Readonly<ClaimsDTO> {
  @IsString()
  sub: string;

  name: string;

  @IsString()
  @ApiProperty()
  state: string;
}
