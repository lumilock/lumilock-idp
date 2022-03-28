// clients.entity.ts
import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Code } from './codes.entity';
import { UsersClients } from './users_clients.entity';

export enum ApplicationType {
  WEB = 'web',
  Native = 'native',
}

// https://openid.net/specs/openid-connect-registration-1_0.html
// Client database
@Entity({ name: 'clients' })
export class Client extends BaseEntity {
  @Column({ name: 'client_name', type: 'varchar', length: 200 })
  clientName: string;

  @Column({ type: 'varchar', length: 200 })
  secret: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  appUrl: string;

  @Column({ type: 'boolean', default: true })
  hide: boolean;

  @Column({ name: 'redirect_uris', type: 'simple-array' })
  redirectUris: string[];

  @Column({
    name: 'application_type',
    type: 'enum',
    enum: ApplicationType,
    default: ApplicationType.WEB,
  })
  applicationType: ApplicationType;

  @Column({
    name: 'logo_uri',
    type: 'varchar',
    nullable: true,
    length: 300,
  })
  logoUri: string;

  @OneToMany(() => Code, (code) => code.client)
  codes: Code[];

  @OneToMany(() => UsersClients, (usersClients) => usersClients.client)
  public usersClients: UsersClients[];
}
