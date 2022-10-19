import React from 'react';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { NavLink } from 'react-router-dom';

import {
  Else, Icon, If, Skeleton, Then, Typography,
} from '../../Atoms';
import { useAuth } from '../../../services/Hooks';
import { remCalc } from '../../../services/Tools';

import { Avatar } from '../../Molecules';
import styles from './NavBarAccount.module.scss';

function NavBarAccount() {
  const { loading, user } = useAuth();

  return (
    <NavLink
      to="profile"
      className={({ isActive }) => ([
        isActive ? styles?.Active : '',
        styles?.Root,
        loading ? styles?.Loading : '',
      ].join(' ').trim())}
    >
      <div className={styles.LeftSection}>
        {/* Avatar Section */}
        <If condition={!loading}>
          <Then>
            <Avatar size="medium" src={user?.picture}>
              {user?.login}
            </Avatar>
          </Then>
          <Else>
            <Skeleton
              variant="circular"
              width="100%"
              height="100%"
              animation="wave"
            />
          </Else>
        </If>

        <div className={styles.TextBox}>
          <If condition={!loading}>
            <Then>
              <Typography variant="h4" color="content1">{user?.preferredUsername || user?.name}</Typography>
              <Typography variant="body2" color="content3">{user?.login}</Typography>
            </Then>
            <Else>
              <Skeleton
                width="60%"
                height={remCalc(15)}
                animation="wave"
              />
              <Skeleton
                width="30%"
                height={remCalc(15)}
                animation="wave"
              />
            </Else>
          </If>
        </div>
      </div>
      <Icon className={styles.Icon} size="small" ionIcon={IoIosArrowRoundForward} />
    </NavLink>
  );
}

export default React.memo(NavBarAccount);
