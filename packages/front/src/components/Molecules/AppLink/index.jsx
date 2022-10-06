import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { Squircle } from '../../Atoms';
import styles from './AppLink.module.scss';

function AppLink({ path, picture, className }) {
  return (
    <NavLink
      to={path}
      className={[
        styles?.Base,
        className,
      ].join(' ').trim()}
    >
      <Squircle size="large" image={picture} />
      <p className="subtitle2">Application avec grand nom</p>
    </NavLink>
  );
}

AppLink.propTypes = {
  path: PropTypes.string,
  className: PropTypes.string,
  picture: PropTypes.string,
};

AppLink.defaultProps = {
  path: '#',
  className: '',
  picture: '',
};

export default React.memo(AppLink);
