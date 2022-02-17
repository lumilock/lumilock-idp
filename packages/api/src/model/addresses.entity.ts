// user.entity.ts
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
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
  @Column({ type: 'varchar', length: 255 })
  public street_address: string;

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
  @Column({ type: 'varchar', length: 100 })
  public postal_code: string;

  /**
   * Country name component.
   */
  @Column({ type: 'varchar', length: 100 })
  public country: string;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @OneToOne(() => User, (user) => user.address)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
