import * as bcrypt from 'bcrypt';

import { UsersService } from '../../users/users.service';
import { UsersDTO } from '../../users/dto/users.dto';
import { User } from '../../model/users.entity';

// User seed
// function to generate users
async function userSeeds(connection) {
  // UserService db connection
  const usersService = new UsersService(
    connection.getRepository(User),
    connection.manager,
  );

  // Hashing password
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync('123456', salt);

  // Generate one specific user by default
  const adminWork = usersService
    .create(
      UsersDTO.from(
        {
          givenName: 'admin',
          familyName: 'admin',
          email: 'admin@admin.fr',
          login: 'admin.admin',
          password: hash,
        },
        true,
      ),
    )
    .then((r) => (console.log('done ->', r.login), r));

  // execute the seed
  return await Promise.all([adminWork]);
}

export default userSeeds;
