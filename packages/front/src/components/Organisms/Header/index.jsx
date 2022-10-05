import React from 'react';

import { AnimatedBackground } from '../../Molecules';

import styles from './Header.module.scss';

function Header() {
  return (
    <div className={styles.Root}>
      <AnimatedBackground mask={false} />
    </div>
  );
}

export default React.memo(Header);
