import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import styles from './Icon.module.scss';
import { pascalCase } from '../../../services/Tools';

const sizesTypes = ['xxsmall', 'xsmall', 'small', 'medium', 'large'];

function Icon({
  ionIcon: Component, size, className, color, ...rest
}) {
  const customSize = useMemo(() => (!sizesTypes.includes(size) ? { size } : {}), [size]);

  const classes = useMemo(() => ({
    xxsmall: 'XXSmall',
    xsmall: 'XSmall',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
  }), []);

  return (
    <Component
      className={[
        styles.Base,
        styles?.[classes?.[size]] || '',
        styles?.[pascalCase(color)],
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
  /**
   * text color variations
   */
  color: PropTypes.oneOf([
    'alert',
    'alert dark',
    'info',
    'standard',
    'main',
    'content1',
    'content2',
    'content3',
    'background1',
    'background2',
    'background3',
  ]),
};

Icon.defaultProps = {
  className: '',
  size: 'small',
  color: 'content1',
};

export default React.memo(Icon);
