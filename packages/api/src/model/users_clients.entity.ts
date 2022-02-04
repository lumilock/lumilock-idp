// clients.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from './clients.entity';
import { User } from './users.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

@Entity({ name: 'users_clients' })
export class UsersClients {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  role: UserRole;

  @Column({ type: 'boolean', default: false })
  authorization: boolean;

  @Column({ type: 'boolean', default: false })
  favorite: boolean;

  @ManyToOne(() => User, (user) => user.usersClients)
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @ManyToOne(() => Client, (client) => client.usersClients)
  @JoinColumn({ name: 'client_id' })
  public client!: Client;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  create_date_time: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  last_changed_date_time: Date;
}
