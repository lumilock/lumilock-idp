import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { IoIosSync } from 'react-icons/io';

import styles from './Icon.module.scss';
import { pascalCase } from '../../../services/Tools';
import { colors } from '../../../services/Theme';

const sizesTypes = ['xxsmall', 'xsmall', 'small', 'medium', 'large'];

function Icon({
  ionIcon, size, className, color, loading, loadingColor, ...rest
}) {
  const customSize = useMemo(() => (!sizesTypes.includes(size) ? { size } : {}), [size]);

  const classes = useMemo(() => ({
    xxsmall: 'XXSmall',
    xsmall: 'XSmall',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
  }), []);

  const Component = useMemo(() => (loading ? IoIosSync : ionIcon), [ionIcon, loading]);

  return (
    <Component
      className={[
        styles.Base,
        loading ? styles.Loading : '',
        styles?.[classes?.[size]] || '',
        styles?.[pascalCase(loading ? loadingColor : color)],
        className,
      ].join(' ').replaceAll('  ', ' ').trim()}
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
  color: PropTypes.oneOf(colors),
  /**
   * Spinner color variations
   */
  loadingColor: PropTypes.oneOf(colors),
  loading: PropTypes.bool,
};

Icon.defaultProps = {
  className: '',
  size: 'small',
  color: 'content1',
  loadingColor: 'content3',
  loading: false,
};

export default React.memo(Icon);
