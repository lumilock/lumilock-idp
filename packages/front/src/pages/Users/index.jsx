import React, { useMemo, useState } from 'react';
import { IoIosPeople } from 'react-icons/io';

import { HeaderWrapper } from '../../components/Species';
import { UsersSection, UsersSideBar } from '../../components/Organisms';
import UsersContext from './UsersContext';
import styles from './Users.module.scss';

function Users() {
  // States
  const [selected, setSelected] = useState('');
  const [filter, setFilter] = useState('');

  // Context value
  const value = useMemo(
    () => ({
      selected,
      setSelected,
      filter,
      setFilter,
    }),
    [filter, selected],
  );

  return (
    <HeaderWrapper icon={IoIosPeople} title="Utilisateurs">
      <UsersContext.Provider value={value}>
        <div className={styles.Root}>
          <UsersSection />
          <UsersSideBar />
        </div>
      </UsersContext.Provider>
    </HeaderWrapper>
  );
}

export default React.memo(Users);
