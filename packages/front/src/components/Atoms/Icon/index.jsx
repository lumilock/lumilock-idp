import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

// servcies
import capitalize from '../../../services/Tools/capitalize';

import styles from './Icon.module.scss';

const sizesTypes = ['tiny', 'small', 'medium', 'large'];

function Icon({
  ionIcon: Component, size, className, ...rest
}) {
  const customSize = useMemo(() => (!sizesTypes.includes(size) ? { size } : {}), [size]);
  return (
    <Component
      className={`${styles.Base}${sizesTypes.includes(size) ? ` ${styles[capitalize(size, false)]}` : ''}${className ? ` ${className}` : ''}`}
      {...customSize}
      {...rest}
    />
  );
}

Icon.propTypes = {
  className: PropTypes.string,
  ionIcon: PropTypes.func.isRequired,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf(sizesTypes),
  ]),
};

Icon.defaultProps = {
  className: '',
  size: 'small',
};

export default React.memo(Icon);
