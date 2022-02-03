// scripts/seed.ts
import * as _ from 'lodash';
import { createConnection, ConnectionOptions } from 'typeorm';
import { configService } from '../config/config.service';
import { UsersService } from '../users/users.service';
import { User } from '../model/users.entity';
import { UsersDTO } from '../users/users.dto';
import { Client } from '../model/clients.entity';
import { ClientsService } from '../clients/clients.service';
import { ClientsDTO } from '../clients/clients.dto';

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
    .map((n) =>
      UsersDTO.from({
        first_name: `first_name-${seedId}-${n}`,
        last_name: `last_name-${seedId}-${n}`,
        email: `${seedId}-${n}@test.fr`,
        login: `${seedId}_${n}_${seedId}-${n}`,
        password: '123456',
      }),
    )
    .map((dto) =>
      usersService
        .create(dto)
        .then((r) => (console.log('done ->', r.login), r)),
    );
  const adminWork = usersService
    .create(
      UsersDTO.from({
        first_name: 'admin',
        last_name: 'admin',
        email: 'admin@admin.fr',
        login: 'admin.admin',
        password: '123456',
      }),
    )
    .then((r) => (console.log('done ->', r.login), r));
  const clientWork = clientsService
    .create(
      ClientsDTO.from({
        name: 'Audit lait cru',
        secret: 'XZHJ_WS1pdAgkwW5U5zFQZZd',
        callback_url: 'http://localhost:3001/callback',
      }),
    )
    .then((r) => (console.log('done ->', r.name, r.id), r));

  return await Promise.all([...work, adminWork, clientWork]);
}

run()
  .then(() => console.log('...wait for script to exit'))
  .catch((error) => console.error('seed error', error));
