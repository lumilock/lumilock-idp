import React from 'react';
import { IoIosPower } from 'react-icons/io';

import { Divider } from '../../Atoms';
import { NavBarAccount, NavBarMenu } from '../../Cells';
import { NavBarItem } from '../../Molecules';

import styles from './Navbar.module.scss';

function Navbar() {
  return (
    <div className={styles.Root}>
      <div className={styles.Navigation}>
        <NavBarAccount />
        <Divider color="background3" />
        <NavBarMenu />
      </div>
      <div className={styles.Disconnection}>
        <NavBarItem title="Déconnexion" icon={IoIosPower} path="/logout" />
      </div>
    </div>
  );
}

export default React.memo(Navbar);
