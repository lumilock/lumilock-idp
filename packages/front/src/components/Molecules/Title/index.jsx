import PropTypes from 'prop-types';
import React from 'react';
import { IoIosStar } from 'react-icons/io';

import { Icon, Typography } from '../../Electrons';
import styles from './Title.module.scss';

function Title({ icon, title, color }) {
  return (
    <div className={[
      styles.Base,
    ].join(' ').trim()}
    >
      <Icon
        size="xsmall"
        ionIcon={icon}
        color={color}
      />
      <Typography color={color} variant="h3">{title}</Typography>
    </div>
  );
}

Title.propTypes = {
  /**
   * icon in front of the title
   */
  icon: PropTypes.func,
  /**
   * Title text
   */
  title: PropTypes.string,
  /**
   * Color of the icon and of the text variations
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

Title.defaultProps = {
  icon: IoIosStar,
  title: 'Title',
  /**
   * text color variations
   */
  color: 'content1',
};

export default React.memo(Title);
