// clients.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Code } from './codes.entity';
import { UsersClients } from './users_clients.entity';

@Entity({ name: 'clients' })
export class Client extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  secret: string;

  @Column({ name: 'callback_url', type: 'varchar', length: 255 })
  callbackUrl: string;

  @OneToMany(() => Code, (code) => code.client)
  codes: Code[];

  @Column({
    name: 'client_picture',
    type: 'varchar',
    nullable: true,
    length: 300,
  })
  clientPicture: string;

  @OneToMany(() => UsersClients, (usersClients) => usersClients.client)
  public usersClients: UsersClients[];
}
