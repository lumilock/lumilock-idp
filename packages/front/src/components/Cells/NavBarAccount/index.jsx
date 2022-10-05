import React from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { NavLink } from 'react-router-dom';
import { Icon, Typography } from '../../Atoms';

import { Avatar } from '../../Molecules';
import styles from './NavBarAccount.module.scss';

function NavBarAccount() {
  return (
    <NavLink
      to="messages"
      className={({ isActive }) => ([
        isActive ? styles?.Active : '',
        styles?.Root,
      ].join(' ').trim())}
    >
      <div className={styles.LeftSection}>
        <Avatar size="medium" src="https://lesmauxdevente.fr/wp-content/uploads/elementor/thumbs/5ho7h-ojnu7wy8fn0val87fu4wn7pb9y2c53uhubqglvq6x4.jpeg" />
        <div className={styles.TextBox}>
          <Typography variant="h4" color="content1">Thibaud Perrin</Typography>
          <Typography variant="body2" color="content3">thibaud.perrin</Typography>
        </div>
      </div>
      <Icon className={styles.Icon} size="small" ionIcon={IoIosArrowRoundForward} />
    </NavLink>
  );
}

export default React.memo(NavBarAccount);
