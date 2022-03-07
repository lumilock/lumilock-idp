// scripts/seed.ts
import { createConnection, ConnectionOptions } from 'typeorm';

import { configService } from '../config/config.service';
import { clientSeeds, userSeeds } from './seeds';

async function run() {
  // const seedUser: User = { id: 'seed-user' };

  const opt = {
    ...configService.getTypeOrmConfig(),
    debug: true,
  };

  const connection = await createConnection(opt as ConnectionOptions);

  // All seed
  const usrSeeds = userSeeds(connection);
  const cltSeeds = clientSeeds(connection);

  return await Promise.all([usrSeeds, cltSeeds]);
}

run()
  .then(() => console.log('...wait for script to exit'))
  .catch((error) => console.error('seed error', error));
