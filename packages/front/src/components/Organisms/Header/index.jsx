import React from 'react';

import TitleSection from '../../Cells/TitleSection';
import { AnimatedBackground } from '../../Molecules';

import styles from './Header.module.scss';

function Header() {
  return (
    <div className={styles.Root}>
      <div className={styles.HeaderTitle}>
        <TitleSection color="background1" />
      </div>
      <AnimatedBackground mask={false} />
    </div>
  );
}

export default React.memo(Header);
