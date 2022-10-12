import React from 'react';
import { IoIosConstruct } from 'react-icons/io';

import { ServiceSideBar, ServicesSection } from '../../components/Organisms';
import { HeaderWrapper } from '../../components/Species';

import styles from './Services.module.scss';

function Services() {
  return (
    <HeaderWrapper icon={IoIosConstruct} title="Services">
      <div className={styles.Root}>
        <ServicesSection />
        <ServiceSideBar />
      </div>
    </HeaderWrapper>
  );
}

export default React.memo(Services);
