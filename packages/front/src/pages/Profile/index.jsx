import React from 'react';
import { IoIosPerson } from 'react-icons/io';

import { HeaderWrapper } from '../../components/Species';

function Profile() {
  return (
    <HeaderWrapper icon={IoIosPerson} title="Profil">
      <h1>Profil</h1>
    </HeaderWrapper>
  );
}

export default React.memo(Profile);
