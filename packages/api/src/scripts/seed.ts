// scripts/seed.ts
import * as _ from 'lodash';
import { createConnection, ConnectionOptions } from 'typeorm';

import { configService } from '../config/config.service';

import { User } from '../model/users.entity';
import { Client } from '../model/clients.entity';

import { UsersDTO } from '../users/users.dto';
import { UsersService } from '../users/users.service';

import { ClientsService } from '../clients/clients.service';
import { ClientsDTO } from '../clients/clients.dto';

import { num2Char } from '../utils';

async function run() {
  // const seedUser: User = { id: 'seed-user' };

  const seedId = Date.now()
    .toString()
    .split('')
    .reverse()
    .join('')
    .substring(0, 4);

  const opt = {
    ...configService.getTypeOrmConfig(),
    debug: true,
  };

  const connection = await createConnection(opt as ConnectionOptions);
  const usersService = new UsersService(connection.getRepository(User));
  const clientsService = new ClientsService(connection.getRepository(Client));

  const work = _.range(1, 10)
    .map((n) => {
      const seedAlpha = num2Char(seedId);
      const indexAlpha = num2Char(n);
      const user = UsersDTO.from(
        {
          givenName: `first-name-${seedAlpha}-${indexAlpha}`,
          familyName: `last-name-${seedAlpha}-${indexAlpha}`,
          email: `${seedAlpha}-${indexAlpha}@test.fr`,
          login: `${seedAlpha}-${indexAlpha}-${seedAlpha}-${indexAlpha}`,
          password: '123456',
        },
        true,
      );
      return user;
    })
    .map((dto: UsersDTO) =>
      usersService
        .create(dto)
        .then((r) => (console.log('done ->', r.login), r)),
    );
  const adminWork = usersService
    .create(
      UsersDTO.from(
        {
          givenName: 'admin',
          familyName: 'admin',
          email: 'admin@admin.fr',
          login: 'admin.admin',
          password: '123456',
        },
        true,
      ),
    )
    .then((r) => (console.log('done ->', r.login), r));
  const clientWork = clientsService
    .create(
      ClientsDTO.from({
        name: 'Audit lait cru',
        secret: 'XZHJ_WS1pdAgkwW5U5zFQZZd',
        callbackUrl: 'http://localhost:8001/callback',
      }),
    )
    .then((r) => (console.log('done ->', r.name, r.id), r));

  return await Promise.all([...work, adminWork, clientWork]);
}

run()
  .then(() => console.log('...wait for script to exit'))
  .catch((error) => console.error('seed error', error));
