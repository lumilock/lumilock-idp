import React, { useMemo, useState } from 'react';
import { IoIosPerson } from 'react-icons/io';
import PropTypes from 'prop-types';

import {
  Choose,
  When, Icon, OtherWise,
} from '../../Electrons';
import styles from './Avatar.module.scss';
import { getInitials, textToColor } from '../../../services/Tools';

function Avatar({
  className, size, image, icon, loadingIcon, children, ...rest
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

  // Get the initial names to display
  const initials = useMemo(() => {
    if (!!children && typeof children === 'string' && children?.length <= 3) {
      return children.toUpperCase() || '';
    } if (!!children && typeof children === 'string' && children?.length > 3) {
      return getInitials(children).toUpperCase() || '';
    }
    return '';
  }, [children]);

  const style = {
    backgroundColor: `#${textToColor(children && typeof children === 'string' ? children : initials, 125, 235)}`,
    color: `#${textToColor(children && typeof children === 'string' ? children : initials, 0, 75)}`,
  };

  return (
    <div
      className={[
        styles.Base,
        className,
        styles?.[classes?.[size]],
      ].join(' ').replaceAll('  ', ' ').trim()}
      style={Object.keys(style).length > 0 ? style : {}}
    >
      <Choose>
        {/* Display image */}
        <When condition={!!image}>
          <figure>
            <img
              alt=""
              {...rest}
              src={image}
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
        <When condition={!!children && typeof children === 'string'}>
          {initials || <span>Empty</span>}
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
  image: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.func,
  loadingIcon: PropTypes.func,
  size: PropTypes.oneOf(['xlarge', 'xxlarge', 'large', 'medium', 'regular', 'small']),
  children: PropTypes.string,
};

Avatar.defaultProps = {
  image: '',
  className: '',
  size: 'medium',
  icon: undefined,
  loadingIcon: IoIosPerson,
  children: undefined,
};

export default React.memo(Avatar);
