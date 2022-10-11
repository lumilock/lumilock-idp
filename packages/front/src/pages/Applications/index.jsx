import React from 'react';
import { IoIosApps } from 'react-icons/io';

import { ApplicationsSection, FavoritesSection } from '../../components/Organisms';
import { HeaderWrapper } from '../../components/Species';
import styles from './Applications.module.scss';

function Applications() {
  return (
    <HeaderWrapper icon={IoIosApps} title="Applications">
      <div className={styles.Root}>
        <FavoritesSection />
        <ApplicationsSection />
      </div>
    </HeaderWrapper>
  );
}

export default React.memo(Applications);
