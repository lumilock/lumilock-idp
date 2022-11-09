import * as bcrypt from 'bcrypt';

import { UsersService } from '../../users/users.service';
import { UsersDTO } from '../../users/dto/users.dto';
import { User } from '../../model/users.entity';
import { getRandomString } from '../../utils';

// User seed
// function to generate users
async function userSeeds(connection) {
  // UserService db connection
  const usersService = new UsersService(
    connection.getRepository(User),
    connection.manager,
  );

  const password = getRandomString(8);
  // Hashing password
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

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
    .then((r) => (console.log('done -> [Users]:', r.login, password), r));

  // execute the seed
  return await Promise.all([adminWork]);
}

export default userSeeds;
