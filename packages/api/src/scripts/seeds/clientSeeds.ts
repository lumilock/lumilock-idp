// Client seeds
import { oidcConstants } from '../../auth/oidcConstants';
import { ClientsDTO } from '../../clients/dto/clients.dto';
import { ClientsService } from '../../clients/clients.service';
import { Client } from '../../model/clients.entity';
import { encrypt, getRandomString } from '../../utils';

// function to generate clients
async function clientSeeds(connection) {
  // ClientsService db connection
  const clientsService = new ClientsService(connection.getRepository(Client));

  const secret = getRandomString(40);
  const hash = encrypt(secret, 'aes-256-ctr', oidcConstants.secretHashKey);

  // Lumilock client
  const clientLauncher = clientsService
    .create(
      ClientsDTO.from(
        {
          clientName: 'Lumilock',
          secret: JSON.stringify(hash),
          redirectUris: [],
          appUrl: process.env.OAUTH2_CLIENT_FRONT_OIDC_URI,
          permissions: ['users', 'clients'],
        },
        false,
      ),
    )
    .then(
      (r) => (console.log('done -> [Clients]:', r.clientName, r.id, secret), r),
    );

  // Other client
  // const clientALC = clientsService
  //   .create(
  //     ClientsDTO.from(
  //       {
  //         clientName: 'Audit lait cru',
  //         secret: 'XZHJ_WS1pdAgkwW5U5zFQZZd',
  //         redirectUris: ['http://192.168.99.1:8001/api/auth/callback'],
  //       },
  //       false,
  //     ),
  //   )
  //   .then((r) => (console.log('done ->', r.clientName, r.id), r));

  // execute the seed
  return await Promise.all([clientLauncher]);
}

export default clientSeeds;
