// Client seeds
import { ClientsDTO } from '../../clients/clients.dto';
import { ClientsService } from '../../clients/clients.service';
import { Client } from '../../model/clients.entity';

// function to generate clients
async function clientSeeds(connection) {
  // ClientsService db connection
  const clientsService = new ClientsService(connection.getRepository(Client));

  // Lumilock client
  const clientLauncher = clientsService
    .create(
      ClientsDTO.from(
        {
          clientName: 'Lumilock',
          secret: process.env.CLIENT_LAUNCHER_SECRET,
          redirectUris: [process.env.CLIENT_LAUNCHER_REDIRECT],
        },
        false,
      ),
    )
    .then((r) => (console.log('done ->', r.clientName, r.id), r));

  // Other client
  const clientALC = clientsService
    .create(
      ClientsDTO.from(
        {
          clientName: 'Audit lait cru',
          secret: 'XZHJ_WS1pdAgkwW5U5zFQZZd',
          redirectUris: ['http://192.168.99.1:8001/api/auth/callback'],
        },
        false,
      ),
    )
    .then((r) => (console.log('done ->', r.clientName, r.id), r));

  // execute the seed
  return await Promise.all([clientLauncher, clientALC]);
}

export default clientSeeds;
