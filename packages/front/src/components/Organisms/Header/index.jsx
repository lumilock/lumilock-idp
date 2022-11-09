import React from 'react';
import { useSelector } from 'react-redux';

import { headerSelector } from '../../../store/header/headerSelector';
import TitleSection from '../../Cells/TitleSection';
import { AnimatedBackground } from '../../Molecules';

import styles from './Header.module.scss';

function Header() {
  // Store
  const header = useSelector(headerSelector);

  return (
    <div className={styles.Root}>
      <div className={styles.HeaderTitle}>
        <TitleSection icon={header?.icon} title={header?.title} variant="gradient" color="background1" />
      </div>
      <AnimatedBackground mask={false} />
    </div>
  );
}

export default React.memo(Header);
