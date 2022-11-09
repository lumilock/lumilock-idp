import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import {
  Else, If, Skeleton, Then,
} from '../../Electrons';
import {
  Squircle,
} from '../../Atoms';
import styles from './AppLink.module.scss';

function AppLink({
  ghost, path, picture, icon, variant, name, className, loading, ...rest
}) {
  const pathname = useMemo(() => (path || '/#'), [path]);
  const Component = useMemo(() => (path ? 'a' : NavLink), [path]);
  return (
    <Component
      href={!ghost ? pathname : '/#'}
      disabled={ghost ? 'disabled' : ''}
      className={[
        styles?.Base,
        className,
      ].join(' ').trim()}
      {...rest}
    >
      <Squircle
        size="large"
        {...(picture ? { image: picture } : {})}
        {...(icon ? { icon } : {})}
        {...(variant ? { variant } : {})}
        loading={loading}
        animation="wave"
      />
      <If condition={!ghost}>
        <Then>
          <p className="subtitle2">{name}</p>
        </Then>
        <Else>
          <div className={styles.GhostSkeleton}>
            <Skeleton width="100%" animation={loading ? 'wave' : false} />
            <Skeleton width="50%" animation={loading ? 'wave' : false} />
          </div>
        </Else>
      </If>
    </Component>
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
  loading: PropTypes.bool,
};

AppLink.defaultProps = {
  ghost: false,
  path: undefined,
  className: '',
  picture: undefined,
  icon: undefined,
  variant: 'standard',
  name: '',
  loading: false,
};

export default React.memo(AppLink);
