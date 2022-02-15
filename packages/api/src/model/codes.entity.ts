// codes.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Client } from './clients.entity';
import { User } from './users.entity';

export enum CodeScope {
  OPENID = 'openid',
}

@Entity({ name: 'codes' })
export class Code {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  code: string;

  @Column({ type: 'enum', enum: CodeScope, default: CodeScope.OPENID })
  scope: CodeScope;

  @ManyToOne(() => Client, (client) => client.codes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @Column({ name: 'client_id', nullable: false })
  clientId: string;

  @ManyToOne(() => User, (user) => user.codes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  create_date_time: Date;
}
