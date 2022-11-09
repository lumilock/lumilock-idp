// authorize.dto.ts
// https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';

import { ClaimsDTO } from './claims.dto';

export enum AuthorizeScope {
  OPENID = 'openid',
  EMAIL = 'email',
  PROFILE = 'profile',
  OPENIDEMAIL = 'openid email',
  OPENIDPROFILE = 'openid profile',
}

export enum AuthorizeResponseType {
  CODE = 'code', // Authorization Code Flow
  TOKEN = 'token',
  IDTOKEN = 'id_token', // Implicit Flow
  OPENID = 'id_token token', // Implicit Flow
  CODEIDTOKEN = 'code id_token', // Hybrid Flow
  CODETOKEN = 'code token', // Hybrid Flow
  CODEIDTOKENTOKEN = 'code id_token token', // Hybrid Flow
  NONE = 'none',
}

export class AuthorizeDTO implements Readonly<AuthorizeDTO> {
  @ApiProperty({ required: true, enum: AuthorizeScope })
  @IsEnum(AuthorizeScope)
  scope: string;

  @ApiProperty({ required: true, enum: AuthorizeResponseType })
  @IsEnum(AuthorizeResponseType)
  response_type: string;

  @ApiProperty({ required: true })
  @IsString()
  client_id: string;

  @ApiProperty({ required: true })
  @IsUrl({ require_tld: false })
  @IsString()
  redirect_uri: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  state: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ClaimsDTO)
  claims: ClaimsDTO;
}
