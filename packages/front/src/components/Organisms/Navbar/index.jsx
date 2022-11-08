import React from 'react';
import { IoIosPower } from 'react-icons/io';

import { Divider } from '../../Electrons';
import { NavBarAccount, NavBarMenu } from '../../Cells';
import { NavBarItem } from '../../Molecules';

import styles from './Navbar.module.scss';
import { useLogout } from '../../../services/Hooks';

function Navbar() {
  // Store
  const logout = useLogout();

  const handleLogout = (e) => {
    logout();
    e.preventDefault();
    return false;
  };

  return (
    <div className={styles.Root}>
      <div className={styles.Navigation}>
        <NavBarAccount />
        <Divider color="background3" />
        <NavBarMenu />
      </div>
      <div className={styles.Disconnection}>
        <NavBarItem title="Déconnexion" icon={IoIosPower} path="/logout" onClick={handleLogout} />
      </div>
    </div>
  );
}

export default React.memo(Navbar);
