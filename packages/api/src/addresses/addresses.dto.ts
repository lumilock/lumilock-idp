// address.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsJSON,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Address } from '../model/addresses.entity';
import { UsersDTO } from '../users/users.dto';

// https://connect2id.com/products/server/docs/api/userinfo
export class AddressesDTO implements Readonly<AddressesDTO> {
  // Id
  @IsUUID()
  @ApiProperty({ required: true })
  id: string;
  /**
   * Full mailing address, formatted for display or use on a mailing label.
   * This field MAY contain multiple lines, separated by newlines.
   * Newlines can be represented either as a carriage return/line feed pair ("\r\n") or as a single line feed character ("\n").
   */
  @IsString()
  @ApiProperty({ required: false })
  formatted: string;

  /**
   * Full street address component, which MAY include house number,
   * street name, Post Office Box, and multi-line extended street address information.
   * This field MAY contain multiple lines, separated by newlines.
   * Newlines can be represented either as a carriage return/line feed pair ("\r\n") or as a single line feed character ("\n").
   */
  @IsString()
  @ApiProperty({ required: true })
  streetAddress: string;

  /**
   * City or locality component.
   */
  @IsString()
  @ApiProperty({ required: true })
  locality: string;
  /**
   * State, province, prefecture, or region component.
   */
  @IsString()
  @ApiProperty({ required: true })
  region: string;

  /**
   * Zip code or postal code component.
   */
  @IsString()
  @ApiProperty({ required: true })
  postalCode: string;

  /**
   * Country name component.
   */
  @IsString()
  @ApiProperty({ required: true })
  country: string;

  @IsJSON()
  @ValidateNested()
  @ApiProperty({ required: true })
  user: UsersDTO;

  // ******
  // Base
  // ******
  @IsBoolean()
  @ApiProperty({ required: false })
  isActive: boolean;

  @IsBoolean()
  @ApiProperty({ required: false })
  isArchived: boolean;

  @IsDate()
  @ApiProperty({ required: false })
  createDateTime: Date;

  @IsDate()
  @ApiProperty({ required: false })
  lastChangedDateTime: Date;

  public static from(dto: Partial<AddressesDTO>) {
    const address = new AddressesDTO();
    address.id = dto.id;
    address.formatted =
      dto.formatted ||
      `${dto.streetAddress} ${dto.postalCode} ${dto.locality}, ${dto.region}, ${dto.country}`;
    address.streetAddress = dto.streetAddress;
    address.locality = dto.locality;
    address.region = dto.region;
    address.postalCode = dto.postalCode;
    address.country = dto.country;
    address.user = dto.user;
    address.isActive = dto.isActive;
    address.isArchived = dto.isArchived;
    address.createDateTime = dto.createDateTime;
    address.lastChangedDateTime = dto.lastChangedDateTime;
    return address;
  }

  public static fromEntity(entity: Address) {
    return this.from({
      id: entity.id,
      formatted: entity.formatted,
      streetAddress: entity.streetAddress,
      locality: entity.locality,
      region: entity.region,
      postalCode: entity.postalCode,
      country: entity.country,
      user: UsersDTO.fromEntity(entity.user),
      isActive: entity.isActive,
      isArchived: entity.isArchived,
      createDateTime: entity.createDateTime,
      lastChangedDateTime: entity.lastChangedDateTime,
    });
  }

  public static fromEntities(entities: Address[]): AddressesDTO[] {
    return entities?.map((entity) =>
      this.from({
        id: entity.id,
        formatted: entity.formatted,
        streetAddress: entity.streetAddress,
        locality: entity.locality,
        region: entity.region,
        postalCode: entity.postalCode,
        country: entity.country,
        user: UsersDTO.fromEntity(entity.user),
        isActive: entity.isActive,
        isArchived: entity.isArchived,
        createDateTime: entity.createDateTime,
        lastChangedDateTime: entity.lastChangedDateTime,
      }),
    );
  }

  public toEntity() {
    const address = new Address();
    address.id = this.id;
    address.formatted =
      this.formatted ||
      `${this.streetAddress} ${this.postalCode} ${this.locality}, ${this.region}, ${this.country}`;
    address.streetAddress = this.streetAddress;
    address.locality = this.locality;
    address.region = this.region;
    address.postalCode = this.postalCode;
    address.country = this.country;
    address.isActive = this.isActive;
    address.isArchived = this.isArchived;
    address.createDateTime = this.createDateTime || new Date();
    address.lastChangedDateTime = this.lastChangedDateTime || new Date();
    return address;
  }
}
