import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import {
  Else, If, Skeleton, Squircle, Then,
} from '../../Atoms';
import styles from './AppLink.module.scss';

function AppLink({
  ghost, path, picture, icon, variant, name, className,
}) {
  return (
    <NavLink
      to={!ghost ? path : '#'}
      disabled={ghost ? 'disabled' : ''}
      className={[
        styles?.Base,
        className,
      ].join(' ').trim()}
    >
      <Squircle
        size="large"
        {...(picture ? { image: picture } : {})}
        {...(icon ? { icon } : {})}
        {...(variant ? { variant } : {})}
      />
      <If condition={!ghost}>
        <Then>
          <p className="subtitle2">{name}</p>
        </Then>
        <Else>
          <div className={styles.GhostSkeleton}>
            <Skeleton width="100%" animation={false} />
            <Skeleton width="50%" animation={false} />
          </div>
        </Else>
      </If>
    </NavLink>
  );
}

AppLink.propTypes = {
  ghost: PropTypes.bool,
  path: PropTypes.string,
  className: PropTypes.string,
  picture: PropTypes.string,
  icon: PropTypes.func,
  variant: PropTypes.oneOf(['standard', 'dashed']),
  name: PropTypes.string,
};

AppLink.defaultProps = {
  ghost: false,
  path: undefined,
  className: '',
  picture: undefined,
  icon: undefined,
  variant: 'standard',
  name: '',
};

export default React.memo(AppLink);
