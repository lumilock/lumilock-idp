import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { IoIosStar, IoIosSync } from 'react-icons/io';

import styles from './Icon.module.scss';
import { pascalCase } from '../../../services/Tools';
import { colors, sizes } from '../../../services/Theme';

function Icon({
  ionIcon, size, className, color, loading, component, loadingColor, ...rest
}) {
  const customSize = useMemo(() => (!sizes.includes(size) ? { size } : {}), [size]);

  const defaultComponent = useMemo(() => component ?? ionIcon, [component, ionIcon]);

  const Component = useMemo(() => (loading ? IoIosSync : defaultComponent), [defaultComponent, loading]);

  return (
    <Component
      className={[
        styles.Base,
        loading ? styles.Loading : '',
        styles?.[sizes?.[size]] || '',
        styles?.[pascalCase(loading ? loadingColor : color)],
        className,
      ].join(' ').replaceAll('  ', ' ').trim()}
      {...customSize}
      {...rest}
    />
  );
}

Icon.propTypes = {
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  className: PropTypes.string,
  ionIcon: PropTypes.func,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf(sizes),
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
  component: undefined,
  className: '',
  ionIcon: IoIosStar,
  size: 'small',
  color: 'content1',
  loadingColor: 'content3',
  loading: false,
};

export default React.memo(Icon);
