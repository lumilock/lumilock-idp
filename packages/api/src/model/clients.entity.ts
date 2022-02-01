// clients.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Code } from './code.entity';

@Entity({ name: 'clients' })
export class Client extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  secret: string;

  @Column({ type: 'varchar', length: 255 })
  callback_url: string;

  @OneToMany(() => Code, (code) => code.client)
  codes: Code[];

  @Column({ type: 'varchar', nullable: true, length: 300 })
  client_picture: string;
}
