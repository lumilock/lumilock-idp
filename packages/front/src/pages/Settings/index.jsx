import React from 'react';
import { IoIosCog } from 'react-icons/io';

import { HeaderWrapper } from '../../components/Species';

function Settings() {
  return (
    <HeaderWrapper icon={IoIosCog} title="Paramètres">
      <h1>Services</h1>
    </HeaderWrapper>
  );
}

export default React.memo(Settings);
