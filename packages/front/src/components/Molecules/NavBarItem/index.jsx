import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { IoIosStar } from 'react-icons/io';
import { Icon } from '../../Atoms';
import styles from './NavBarItem.module.scss';

function NavBarItem({
  icon, title, className, path,
}) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) => ([
        isActive ? styles?.Active : '',
        styles?.Base,
        className,
      ].join(' ').trim())}
    >
      <Icon
        ionIcon={icon}
        size="xxsmall"
      />
      <p className={styles.Title}>{title}</p>
    </NavLink>
  );
}

NavBarItem.propTypes = {
  icon: PropTypes.func,
  title: PropTypes.string,
  className: PropTypes.string,
  path: PropTypes.string,
};

NavBarItem.defaultProps = {
  icon: IoIosStar,
  title: 'Title',
  className: '',
  path: '/',
};

export default React.memo(NavBarItem);
