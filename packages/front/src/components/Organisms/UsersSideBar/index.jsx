import React, { useContext } from 'react';

import UsersContext from '../../../pages/Users/UsersContext';
import { ToggleSideBar } from '../../Molecules';

function UsersSideBar() {
  // Context
  const {
    selected,
  } = useContext(UsersContext);

  return (
    <ToggleSideBar open={!!selected}>
      test
    </ToggleSideBar>
  );
}

export default React.memo(UsersSideBar);
