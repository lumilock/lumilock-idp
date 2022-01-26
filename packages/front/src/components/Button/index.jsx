import React from 'react';
import PropTypes from 'prop-types';
import { IoLogoIonic } from 'react-icons/io5';

// services
import capitalize from '../../services/Tools/capitalize';

// Components
import Icon from '../Icon';
import If from '../If';

// local
import styles from './Button.module.scss';

function Button({
  startIcon, endIcon, onClick, color, children, className, loading, ...rest
}) {
  return (
    <button type="button" onClick={onClick} disabled={loading ? 'disabled' : ''} className={`${styles.Base} ${styles[capitalize(color)]} ${className}`} {...rest}>
      <If condition={!!startIcon}>
        <Icon
          ionIcon={loading ? IoLogoIonic : startIcon}
          title=""
          size="xSmall"
          rotate={loading}
          className={styles.Icon}
        />
      </If>
      {children}
      <If condition={!!endIcon}>
        <Icon
          ionIcon={loading ? IoLogoIonic : endIcon}
          title=""
          size="xSmall"
          rotate={loading}
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
  color: PropTypes.oneOf(['primary', 'secondary', 'white']),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  loading: PropTypes.bool,
};

Button.defaultProps = {
  startIcon: undefined,
  endIcon: undefined,
  color: 'primary',
  className: '',
  onClick: () => { },
  loading: false,
};

export default React.memo(Button);
