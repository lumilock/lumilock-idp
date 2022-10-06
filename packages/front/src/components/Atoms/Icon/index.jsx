import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import styles from './Icon.module.scss';

const sizesTypes = ['xxsmall', 'xsmall', 'small', 'medium', 'large'];

function Icon({
  ionIcon: Component, size, className, ...rest
}) {
  const customSize = useMemo(() => (!sizesTypes.includes(size) ? { size } : {}), [size]);

  const classes = useMemo(() => ({
    xxsmall: 'XXSmall',
    xsmall: 'XSmall',
    small: 'Small',
    medium: 'Medium',
    large: 'large',
  }), []);

  return (
    <Component
      className={[
        styles.Base,
        styles?.[classes?.[size]] || '',
        className,
      ].join(' ').trim()}
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
