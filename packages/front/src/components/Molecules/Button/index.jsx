import React from 'react';
import PropTypes from 'prop-types';
import { IoLogoIonic } from 'react-icons/io5';

import capitalize from '../../../services/Tools/capitalize';
import { colors, sizes } from '../../../services/Theme';
import Icon from '../../Electrons/Icon';
import If from '../../Electrons/If';
import styles from './Button.module.scss';

function Button({
  startIcon, endIcon, onClick, color, size, children, className, loading, variant, ...rest
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading ? 'disabled' : ''}
      className={[
        styles.Base,
        styles?.[colors[color]],
        styles?.[sizes[size]],
        styles?.[capitalize(variant)],
        className,
      ].join(' ').replaceAll('  ', ' ').trim()}
      {...rest}
    >
      <div className={styles.Content}>
        <If condition={!!startIcon}>
          <Icon
            ionIcon={loading ? IoLogoIonic : startIcon}
            title=""
            size="xsmall"
            color={variant === 'text' ? color : 'background1'}
            className={styles.Icon}
          />
        </If>
        {children}
        <If condition={!!endIcon}>
          <Icon
            ionIcon={loading ? IoLogoIonic : endIcon}
            title=""
            size="xsmall"
            color={variant === 'text' ? color : 'background1'}
            className={styles.Icon}
          />
        </If>
      </div>
    </button>
  );
}

Button.propTypes = {
  startIcon: PropTypes.func,
  endIcon: PropTypes.func,
  onClick: PropTypes.func,
  className: PropTypes.string,
  color: PropTypes.oneOf(colors),
  variant: PropTypes.oneOf(['text', 'contained']),
  size: PropTypes.oneOf(sizes),
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
  color: 'main',
  size: 'small',
  className: '',
  onClick: () => {},
  loading: false,
};

export default React.memo(Button);
