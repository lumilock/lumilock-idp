// user.entity.ts
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './users.entity';

// addresses table entity
@Entity({ name: 'addresses' })
export class Address extends BaseEntity {
  /**
   * The full mailing address, with multiple lines if necessary.
   * Newlines can be represented either as a \r\n or as a \n.
   */
  @Column({ type: 'varchar', length: 300 })
  public formatted: string;

  /**
   * The street address component, which may include house number,
   * stree name, post office box, and other multi-line information.
   * Newlines can be represented either as a \r\n or as a \n.
   */
  @Column({ name: 'street_address', type: 'varchar', length: 255 })
  public streetAddress: string;

  /**
   * City or locality component
   */
  @Column({ type: 'varchar', length: 195 })
  public locality: string;

  /**
   * State, province, prefecture or region component.
   */
  @Column({ type: 'varchar', length: 195 })
  public region: string;

  /**
   * Zip code or postal code component.
   */
  @Column({ name: 'postal_code', type: 'varchar', length: 100 })
  public postalCode: string;

  /**
   * Country name component.
   */
  @Column({ type: 'varchar', length: 100 })
  public country: string;

  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // @Column({ name: 'user_id', nullable: false })
  // userId: string;
}
