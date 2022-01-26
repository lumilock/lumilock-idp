import React from 'react';
import PropTypes from 'prop-types';

// servcies
import capitalize from '../../services/Tools/capitalize';

import styles from './Icon.module.scss';

function Icon({
  ionIcon: Component, size, className, ...rest
}) {
  return (
    <Component
      className={`${styles.Base} ${styles[capitalize(size, false)]} ${className || ''}`}
      {...rest}
    />
  );
}

Icon.propTypes = {
  className: PropTypes.string,
  ionIcon: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['xSmall', 'small', 'medium', 'large']),
};

Icon.defaultProps = {
  className: '',
  size: 'small',
};

export default React.memo(Icon);
