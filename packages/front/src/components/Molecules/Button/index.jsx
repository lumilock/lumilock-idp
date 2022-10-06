import React from 'react';
import PropTypes from 'prop-types';
import { IoLogoIonic } from 'react-icons/io5';

// services
import capitalize from '../../../services/Tools/capitalize';

// Components
import Icon from '../../Atoms/Icon';
import If from '../../Atoms/If';

// local
import styles from './Button.module.scss';

function Button({
  startIcon, endIcon, onClick, color, children, className, loading, variant, ...rest
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading ? 'disabled' : ''}
      className={`${styles.Base} ${styles[capitalize(color)]} ${styles[capitalize(variant)]} ${className}`}
      {...rest}
    >
      <If condition={!!startIcon}>
        <Icon
          ionIcon={loading ? IoLogoIonic : startIcon}
          title=""
          size="xsmall"
          className={styles.Icon}
        />
      </If>
      {children}
      <If condition={!!endIcon}>
        <Icon
          ionIcon={loading ? IoLogoIonic : endIcon}
          title=""
          size="xsmall"
          className={styles.Icon}
        />
      </If>
    </button>
  );
}

Button.propTypes = {
  startIcon: PropTypes.func,
  endIcon: PropTypes.func,
  onClick: PropTypes.func,
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'white', 'black']),
  variant: PropTypes.oneOf(['standard', 'contained']),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  loading: PropTypes.bool,
};

Button.defaultProps = {
  startIcon: undefined,
  endIcon: undefined,
  variant: 'contained',
  color: 'primary',
  className: '',
  onClick: () => {},
  loading: false,
};

export default React.memo(Button);
