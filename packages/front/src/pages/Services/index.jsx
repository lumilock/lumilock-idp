import React, { useMemo, useState } from 'react';
import { IoIosConstruct } from 'react-icons/io';

import { ServicesSideBar, ServicesSection } from '../../components/Organisms';
import { HeaderWrapper } from '../../components/Species';

import styles from './Services.module.scss';
import ServicesContext from './ServicesContext';

function Services() {
  // States
  const [selected, setSelected] = useState('');
  const [filter, setFilter] = useState('');

  // Context value
  const value = useMemo(
    () => ({
      selected,
      setSelected,
      filter,
      setFilter,
    }),
    [selected, filter],
  );

  return (
    <HeaderWrapper icon={IoIosConstruct} title="Services">
      <ServicesContext.Provider value={value}>
        <div className={styles.Root}>
          <ServicesSection />
          <ServicesSideBar />
        </div>
      </ServicesContext.Provider>
    </HeaderWrapper>
  );
}

export default React.memo(Services);
