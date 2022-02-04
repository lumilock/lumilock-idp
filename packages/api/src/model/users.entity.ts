// user.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UsersClients } from './users_clients.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', unique: true, length: 300 })
  public login: string;

  @Column({ type: 'varchar', length: 100 })
  public first_name: string;

  @Column({ type: 'varchar', length: 100 })
  public last_name: string;

  @Column({ type: 'varchar', nullable: true, unique: true, length: 195 })
  public email: string;

  @Column({ type: 'varchar', nullable: true, length: 300 })
  public profile_picture: string;

  @Column({ type: 'varchar', length: 200 })
  public password: string;

  @OneToMany(() => UsersClients, (usersClients) => usersClients.user)
  public usersClients: UsersClients[];
}
