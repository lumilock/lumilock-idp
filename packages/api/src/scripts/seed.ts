// scripts/seed.ts
import * as _ from 'lodash';
import { createConnection, ConnectionOptions } from 'typeorm';
import { configService } from '../config/config.service';
// import { User } from '../user.decorator';
import { UsersService } from '../users/users.service';
import { User } from '../model/users.entity';
import { UsersDTO } from '../users/users.dto';

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

  return await Promise.all(work);
}

run()
  .then(() => console.log('...wait for script to exit'))
  .catch((error) => console.error('seed error', error));
