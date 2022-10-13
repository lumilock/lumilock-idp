import React, { useMemo, useState } from 'react';
import { IoIosPerson } from 'react-icons/io';
import PropTypes from 'prop-types';

import {
  Choose,
  When, Icon, OtherWise,
} from '../../Atoms';
import styles from './Avatar.module.scss';

function Avatar({
  className, size, src, icon, loadingIcon, children, ...rest
}) {
  const [loaded, setLoaded] = useState(false);

  // Corresponding table between size and classes
  const classes = useMemo(() => ({
    xlarge: 'XLarge',
    xxlarge: 'XXLarge',
    large: 'Large',
    medium: 'Medium',
    regular: 'Regular',
    small: 'Small',
  }), []);

  return (
    <div className={[styles.Base, className, styles?.[classes?.[size]]].join(' ').trim()}>
      <Choose>
        {/* Display image */}
        <When condition={!!src}>
          <figure>
            <img
              alt=""
              src={src}
              {...rest}
              className={styles.Image}
              style={loaded ? {} : { display: 'none' }}
              onLoad={() => setLoaded(true)}
            />
          </figure>
          <Icon
            style={!loaded ? {} : { display: 'none' }}
            className={styles.Icon}
            ionIcon={loadingIcon}
          />
        </When>
        {/* Display Icon */}
        <When condition={!!icon}>
          <Icon
            className={styles.Icon}
            ionIcon={icon}
          />
        </When>
        {/* Display Initial */}
        <When condition={!!children && typeof children === 'string' && children?.length <= 3}>
          {children || <span>Empty</span>}
        </When>
        {/* Display Default Icon */}
        <OtherWise>
          <Icon
            className={styles.Icon}
            ionIcon={IoIosPerson}
          />
        </OtherWise>
      </Choose>
    </div>
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.func,
  loadingIcon: PropTypes.func,
  size: PropTypes.oneOf(['xlarge', 'xxlarge', 'large', 'regular', 'medium', 'small']),
  children: PropTypes.string,
};

Avatar.defaultProps = {
  src: '',
  className: '',
  size: 'medium',
  icon: undefined,
  loadingIcon: IoIosPerson,
  children: undefined,
};

export default React.memo(Avatar);
