// authorize.dto.ts
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

// https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest

export enum AuthorizeScope {
  OPENID = 'openid',
}

export enum AuthorizeResponseType {
  CODE = 'code', // Authorization Code Flow
  IDTOKEN = 'id_token', // Implicit Flow
  OPENID = 'id_token token', // Implicit Flow
  CODEIDTOKEN = 'code id_token', // Hybrid Flow
  CODETOKEN = 'code token', // Hybrid Flow
  CODEIDTOKENTOKEN = 'code id_token token', // Hybrid Flow
}

export class AuthorizeDTO implements Readonly<AuthorizeDTO> {
  @IsEnum(AuthorizeScope)
  @ApiProperty({ required: true, enum: AuthorizeScope })
  scope: string;

  @IsEnum(AuthorizeResponseType)
  @ApiProperty({ required: true, enum: AuthorizeResponseType })
  response_type: string;

  @IsString()
  @ApiProperty({ required: true })
  client_id: string;

  @IsUrl({ require_tld: false })
  @IsString()
  @ApiProperty({ required: true })
  redirect_uri: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  state: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ClaimsDTO)
  @ApiProperty({ required: false })
  claims: ClaimsDTO;
}
