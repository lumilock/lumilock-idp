import React, { useContext } from 'react';

import UsersContext from '../../../pages/Users/UsersContext';
import { UserSideBarContent } from '../../Cells';
import { ToggleSideBar } from '../../Molecules';

function UsersSideBar() {
  // Context
  const {
    selected,
  } = useContext(UsersContext);

  return (
    <ToggleSideBar open={!!selected}>
      <UserSideBarContent id={selected} />
    </ToggleSideBar>
  );
}

export default React.memo(UsersSideBar);
