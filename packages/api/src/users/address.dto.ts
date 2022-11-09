// address.dto.ts
import { IsString } from 'class-validator';

// https://openid.net/specs/openid-connect-core-1_0.html#AddressClaim
export class AddressDTO implements Readonly<AddressDTO> {
  /**
   * Full mailing address, formatted for display or use on a mailing label.
   * This field MAY contain multiple lines, separated by newlines.
   * Newlines can be represented either as a carriage return/line feed pair ("\r\n") or as a single line feed character ("\n").
   */
  @IsString()
  formatted: string;

  /**
   * Full street address component, which MAY include house number,
   * street name, Post Office Box, and multi-line extended street address information.
   * This field MAY contain multiple lines, separated by newlines.
   * Newlines can be represented either as a carriage return/line feed pair ("\r\n") or as a single line feed character ("\n").
   */
  @IsString()
  street_address: string;

  /**
   * City or locality component.
   */
  @IsString()
  locality: string;
  /**
   * State, province, prefecture, or region component.
   */
  @IsString()
  region: string;

  /**
   * Zip code or postal code component.
   */
  @IsString()
  postal_code: string;

  /**
   * Country name component.
   */
  @IsString()
  country: string;
}
