import React from 'react';
import { IoIosPeople } from 'react-icons/io';

import { HeaderWrapper } from '../../components/Species';

function Users() {
  return (
    <HeaderWrapper icon={IoIosPeople} title="Utilisateurs">
      <h1>Utilisateurs</h1>
    </HeaderWrapper>
  );
}

export default React.memo(Users);
