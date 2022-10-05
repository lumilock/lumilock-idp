import React from 'react';

import { Divider } from '../../Atoms';
import { NavBarAccount } from '../../Cells';

import styles from './Navbar.module.scss';

function Navbar() {
  return (
    <div className={styles.Root}>
      <NavBarAccount />
      <Divider color="background3" />
      <h1>menu</h1>
    </div>
  );
}

export default React.memo(Navbar);
