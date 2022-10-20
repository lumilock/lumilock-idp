import React, { useContext } from 'react';

import UsersContext from '../../../pages/Users/UsersContext';
import { UserSideBarContent } from '../../Cells';
import { ToggleSideBar } from '../../Molecules';
import styles from './UsersSideBar.module.scss';

function UsersSideBar() {
  // Context
  const {
    selected,
  } = useContext(UsersContext);

  return (
    <ToggleSideBar open={!!selected}>
      <div className={styles.FlexContainer}>
        <UserSideBarContent id={selected} />
      </div>
    </ToggleSideBar>
  );
}

export default React.memo(UsersSideBar);
