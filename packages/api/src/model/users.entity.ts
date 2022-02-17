// user.entity.ts
import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { Address } from './addresses.entity';
import { BaseEntity } from './base.entity';
import { Code } from './codes.entity';
import { UsersClients } from './users_clients.entity';

// Different user gender possible
export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

// users table entity
@Entity({ name: 'users' })
export class User extends BaseEntity {
  /**
   * A unique id string used to login in the end-user
   */
  @Column({ type: 'varchar', unique: true, length: 300 })
  public login: string;

  /**
   * Password used to login in the end-user
   */
  @Column({ type: 'varchar', length: 200 })
  public password: string;

  /**
   * The full name of the end-user, with optional language tag
   */
  @Column({ type: 'varchar', length: 100 })
  public name: string;

  /**
   * The given or first name of the end-user
   */
  @Column({ type: 'varchar', length: 100 })
  public given_name: string;

  /**
   * The surname(s) or last name(s) of the end-user
   */
  @Column({ type: 'varchar', length: 100 })
  public family_name: string;

  /**
   * The middle name of the end-user
   */
  @Column({ type: 'varchar', nullable: true, length: 100 })
  public middle_name: string;

  /**
   * The casual name of the end-user
   */
  @Column({ type: 'varchar', nullable: true, length: 100 })
  public nickname: string;

  /**
   * The username by which the end-user wants to be referred to at the client application.
   */
  @Column({ type: 'varchar', nullable: true, length: 100 })
  public preferred_username: string;

  /**
   * The URL of the profile page for the end-user
   */
  @Column({ type: 'varchar', nullable: true, length: 300 })
  public profile: string;

  /**
   * The URL of the profile picture for the end-user
   */
  @Column({ type: 'varchar', nullable: true, length: 300 })
  public picture: string;

  /**
   * The URL of the end-user's web page or blog.
   */
  @Column({ type: 'varchar', nullable: true, length: 300 })
  public website: string;

  /**
   * The end-user's preferred email address.
   */
  @Column({ type: 'varchar', nullable: true, unique: true, length: 195 })
  public email: string;

  /**
   * True if the end-user's email address has been verified, else false.
   */
  @Column({ type: 'boolean', default: false })
  public email_verified: boolean;

  /**
   * The end-user's gender.
   */
  @Column({
    type: 'enum',
    enum: UserGender,
    default: UserGender.OTHER,
  })
  gender: UserGender;

  /**
   * The end-user's birthday, represented in ISO 8601:2004 YYYY-MM-DD format.
   * The year may be 0000, indicating that it is omitted. To represent only the year, YYYY format is allowed.
   */
  @Column({ type: 'date', nullable: true, default: '0000-00-00' })
  public birthdate: Date;

  /**
   * The end-user's time zone, e.g. Europe/Paris or America/Los_Angeles.
   */
  @Column({ type: 'varchar', length: 100, default: 'UTC' })
  public zoneinfo: string;

  /**
   * The end-user's locale, represented as a BCP47 language tag.
   * This is typically an ISO 639-1 Alpha-2 language code in lowercase and an ISO 3166-1 Alpha-2 country code in uppercase,
   * separated by a dash. For example, en-US or fr-CA.
   */
  @Column({ type: 'varchar', length: 20, default: 'fr-FR' })
  public locale: string;

  /**
   * The end-user's preferred telephone number, typically in E.164 format,
   * for example +1 (425) 555-1212 or +56 (2) 687 2400.
   */
  @Column({ type: 'varchar', nullable: true, length: 50 })
  public phone_number: string;

  /**
   * True if the end-user's telephone number has been verified, else false.
   */
  @Column({ type: 'boolean', default: false })
  public phone_number_verified: boolean;

  /**
   * Id of the end-user's preferred postal address.
   */
  @Column({ name: 'address_id', nullable: true })
  addressId: string;

  /**
   * A JSON object describing the end-user's preferred postal address.
   */
  @OneToOne(() => Address, (address) => address.user)
  @JoinColumn({ name: 'address_id' })
  address: Address;

  @OneToMany(() => Code, (code) => code.user)
  codes: Code[];

  @OneToMany(() => UsersClients, (usersClients) => usersClients.user)
  public usersClients: UsersClients[];
}
