import React from 'react';
import { IoIosConstruct } from 'react-icons/io';

import { HeaderWrapper } from '../../components/Species';

function Services() {
  return (
    <HeaderWrapper icon={IoIosConstruct} title="Services">
      <h1>Services</h1>
    </HeaderWrapper>
  );
}

export default React.memo(Services);
