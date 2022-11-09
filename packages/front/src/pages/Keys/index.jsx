import React from 'react';
import { IoIosKey } from 'react-icons/io';

import { HeaderWrapper } from '../../components/Species';

function Keys() {
  return (
    <HeaderWrapper icon={IoIosKey} title="Clefs">
      <h1>Keys</h1>
    </HeaderWrapper>
  );
}

export default React.memo(Keys);
