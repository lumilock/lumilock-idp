import { UsersService } from '../../users/users.service';
import { UsersDTO } from '../../users/users.dto';
import { User } from '../../model/users.entity';

// User seed
// function to generate users
async function userSeeds(connection) {
  // UserService db connection
  const usersService = new UsersService(connection.getRepository(User));

  // Generate one specific user by default
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

  // execute the seed
  return await Promise.all([adminWork]);
}

export default userSeeds;
