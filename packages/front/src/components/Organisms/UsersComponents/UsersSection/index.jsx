import React, { useCallback, useContext, useMemo } from 'react';

import UsersContext from '../../../../pages/Users/UsersContext';
import { Users } from '../../../../services/Api';
import { useEffectOnce, useRequestStates } from '../../../../services/Hooks';

import {
  Choose, OtherWise, Typography, When,
} from '../../../Electrons';
import { UserRow, UsersActionBar } from '../../../Cells';
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
    selected, setSelected, filter,
  } = useContext(UsersContext);

  // Filter by user full name
  const filterByName = useCallback((u) => !filter || u?.name?.toLowerCase().includes(filter?.toLowerCase()), [filter]);
  // new user list after filtering it
  const filteredUsers = useMemo(() => users?.filter(filterByName), [filterByName, users]);

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
      <UsersActionBar />
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
              {filteredUsers?.length > 0 ? filteredUsers?.map((user) => (
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
              )) : <div className={styles.NotFound}><Typography variant="h3" color="alert dark">Aucun utilisateur trouvé</Typography></div>}
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
