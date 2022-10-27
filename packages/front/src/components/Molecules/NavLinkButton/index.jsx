import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { sizes } from '../../../services/Theme';
import { Icon } from '../../Electrons';
import styles from './NavLinkButton.module.scss';

function NavLinkButton({
  loading, disabled, iconProps, size, variant, ...rest
}) {
  const classes = {
    plain: 'Plain',
    outlined: 'Outlined',
  };

  return (
    <NavLink
      {...rest}
      className={clsx(styles.Base, styles?.[sizes[size]], styles?.[classes?.[variant]])}
      disabled={disabled ? 'disabled' : ''}
    >
      <Icon
        loading={loading}
        {...iconProps}
      />
    </NavLink>
  );
}

NavLinkButton.propTypes = {
  /**
   * Determine if the link is disabled
   */
  disabled: PropTypes.bool,
  /**
   * All available props for Icon component
   */
  // eslint-disable-next-line react/forbid-prop-types
  iconProps: PropTypes.object,
  /**
   * Determine if the link is loading
   */
  loading: PropTypes.bool,
  /**
   * Button size
   */
  size: PropTypes.oneOf(sizes),
  /**
   * Style variants
   */
  variant: PropTypes.oneOf(['plain', 'outlined']),
};

NavLinkButton.defaultProps = {
  disabled: false,
  iconProps: {},
  loading: false,
  size: 'small',
  variant: 'plain',
};

export default React.memo(NavLinkButton);
