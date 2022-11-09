import React, { useContext } from 'react';

import ServicesContext from '../../../../pages/Services/ServicesContext';
import { ServiceSideBarContent } from '../../../Cells';
import { ToggleSideBar } from '../../../Molecules';

function ServicesSideBar() {
  // Context
  const {
    selected,
  } = useContext(ServicesContext);

  return (
    <ToggleSideBar open={!!selected}>
      <ServiceSideBarContent id={selected} />
    </ToggleSideBar>
  );
}

export default React.memo(ServicesSideBar);
