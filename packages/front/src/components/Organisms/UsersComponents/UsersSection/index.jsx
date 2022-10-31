import React, { useCallback, useContext } from 'react';

import UsersContext from '../../../../pages/Users/UsersContext';
import { Users } from '../../../../services/Api';
import { useEffectOnce, useRequestStates } from '../../../../services/Hooks';
import {
  Choose, OtherWise, Typography, When,
} from '../../../Electrons';
import { UserRow } from '../../../Cells';
import styles from './UsersSection.module.scss';

function UsersSection() {
  const [
    users,
    errors,
    success,
    loading,
    setUsers,
    setErrors,
    setSuccess,
    setLoading,
  ] = useRequestStates([]);
  // Context
  const {
    // eslint-disable-next-line no-unused-vars
    selected, setSelected,
  } = useContext(UsersContext);

  const fetchUsers = useCallback(
    async () => {
      setErrors('');
      setSuccess('');
      setLoading(true);
      await Users.all()
        .then(async (response) => {
          if ([200].includes(response?.status)) {
            return response?.json();
          }
          throw new Error(response?.statusText);
        }).then((response) => {
          setUsers([...response] || []);
          setSuccess('Users has been correctly loaded');
          setLoading(false);
        }).catch((err) => {
          if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('ERROR: [fetchUsers - Users.all]', err);
          }
          setUsers([]);
          setErrors('Impossible de charger les utilisateurs');
          setLoading(false);
        });
    },
    [setErrors, setLoading, setSuccess, setUsers],
  );

  useEffectOnce(() => {
    fetchUsers();
  });

  return (
    <div className={styles.Root}>
      <div className={styles.UsersContainer}>
        <Choose>
          <When condition={!!loading}>
            <div className={styles.Box}>
              {Array.from({ length: 10 }, (_, v) => v).map((value) => (
                <UserRow
                  id={value.toString()}
                  key={value}
                  disabled
                  loading
                />
              ))}
            </div>
          </When>
          <When condition={!!errors}>
            <Typography color="alert">{errors}</Typography>
          </When>
          <When condition={!!success && users.length > 0}>
            <div className={styles.Box}>
              {users.map((user) => (
                <UserRow
                  key={user?.id}
                  image={user?.picture}
                  name={user?.name}
                  login={user?.login}
                  id={user?.id}
                  gender={user?.gender}
                  locality={user?.locality}
                  selected={user?.id === selected}
                  setSelected={setSelected}
                />
              ))}
            </div>
          </When>
          <OtherWise>
            <p>No users</p>
          </OtherWise>
        </Choose>
      </div>
    </div>

  );
}

export default React.memo(UsersSection);
