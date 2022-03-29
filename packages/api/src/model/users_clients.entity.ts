// clients.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Client } from './clients.entity';
import { User } from './users.entity';

export enum UserRole {
  NONE = 'none', // users has no access to the client
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

@Entity({ name: 'users_clients' })
@Unique(['userId', 'clientId'])
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

  // Users permission one the current client
  @Column({ name: 'permissions', type: 'simple-array' })
  permissions: string[];

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @ManyToOne(() => User, (user) => user.usersClients)
  @JoinColumn({ name: 'user_id' })
  public user!: User;

  @Column({ name: 'client_id', nullable: false })
  clientId: string;

  @ManyToOne(() => Client, (client) => client.usersClients)
  @JoinColumn({ name: 'client_id' })
  public client!: Client;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  create_date_time: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  last_changed_date_time: Date;
}
