import React from 'react';
import { IoIosConstruct } from 'react-icons/io';

import { ServicesSection } from '../../components/Organisms';
import { HeaderWrapper } from '../../components/Species';

function Services() {
  return (
    <HeaderWrapper icon={IoIosConstruct} title="Services">
      <div>
        <ServicesSection />
        {/* <ApplicationsSection /> */}
      </div>
    </HeaderWrapper>
  );
}

export default React.memo(Services);
