// user.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', unique: true, length: 300 })
  login: string;

  @Column({ type: 'varchar', length: 100 })
  first_name: string;

  @Column({ type: 'varchar', length: 100 })
  last_name: string;

  @Column({ type: 'varchar', nullable: true, unique: true, length: 195 })
  email: string;

  @Column({ type: 'varchar', nullable: true, length: 300 })
  profile_picture: string;

  @Column({ type: 'varchar', length: 200 })
  password: string;
}
