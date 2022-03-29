// UsersClients seeds
import { UserRole, UsersClients } from 'src/model/users_clients.entity';
import { UsersClientsDTO } from 'src/users-clients/users-clients.dto';
import { UsersClientsService } from 'src/users-clients/users-clients.service';
import { Connection } from 'typeorm';

// function to generate the relation between the admin and the launcher
async function usersClientsSeeds(
  connection: Connection,
  adminId: string,
  LauncherId: string,
) {
  // ClientsService db connection
  const usersClientsService = new UsersClientsService(
    connection.getRepository(UsersClients),
  );

  // Lumilock client
  const adminLauncherPivot = usersClientsService
    .create(
      UsersClientsDTO.from({
        role: UserRole.ADMIN,
        authorization: true,
        favorite: false,
        permissions: ['users', 'clients'],
        user_id: adminId,
        client_id: LauncherId,
      }),
    )
    .then((r) => (console.log('done ->', r.id), r));

  return await Promise.all([adminLauncherPivot]);
}

export default usersClientsSeeds;
