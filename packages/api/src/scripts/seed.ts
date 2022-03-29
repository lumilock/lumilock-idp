// scripts/seed.ts
import { createConnection, ConnectionOptions } from 'typeorm';

import { configService } from '../config/config.service';
import { clientSeeds, usersClientsSeeds, userSeeds } from './seeds';

async function run() {
  const opt = {
    ...configService.getTypeOrmConfig(),
    debug: true,
  };

  const connection = await createConnection(opt as ConnectionOptions);

  // All seed
  const usrSeeds = await userSeeds(connection);
  const cltSeeds = await clientSeeds(connection);
  await usersClientsSeeds(connection, usrSeeds[0].id, cltSeeds[0].id);

  // return await Promise.all([usrSeeds, cltSeeds]);
}

run()
  .then(() => console.log('...wait for script to exit'))
  .catch((error) => console.error('seed error', error));
