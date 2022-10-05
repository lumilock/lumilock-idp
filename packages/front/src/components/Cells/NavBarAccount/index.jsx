import React, { useMemo } from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { NavLink } from 'react-router-dom';

import { useAuth } from '../../../services/Hooks';
import { getInitials } from '../../../services/Tools';
import { Icon, Typography } from '../../Atoms';

import { Avatar } from '../../Molecules';
import styles from './NavBarAccount.module.scss';

function NavBarAccount() {
  const { user } = useAuth();
  const initial = useMemo(() => (!user?.picture ? getInitials(user?.name?.s) || '' : ''), [user?.name, user?.picture]);

  return (
    <NavLink
      to="profil"
      className={({ isActive }) => ([
        isActive ? styles?.Active : '',
        styles?.Root,
      ].join(' ').trim())}
    >
      <div className={styles.LeftSection}>
        <Avatar size="medium" src={user?.picture}>
          {initial}
        </Avatar>

        <div className={styles.TextBox}>
          <Typography variant="h4" color="content1">{user?.preferredUsername || user?.name}</Typography>
          <Typography variant="body2" color="content3">{user?.login}</Typography>
        </div>
      </div>
      <Icon className={styles.Icon} size="small" ionIcon={IoIosArrowRoundForward} />
    </NavLink>
  );
}

export default React.memo(NavBarAccount);
