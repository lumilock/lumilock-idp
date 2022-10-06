import PropTypes from 'prop-types';
import React from 'react';
import { IoIosStar } from 'react-icons/io';

import { pascalCase } from '../../../services/Tools';
import { Icon, Typography } from '../../Atoms';
import styles from './Title.module.scss';

function Title({ icon, title, color }) {
  return (
    <div className={[
      styles.Base,
      styles?.[pascalCase(color)],
    ].join(' ').trim()}
    >
      <Icon
        size="xxsmall"
        ionIcon={icon}
      />
      <Typography color={color} variant="h3">{title}</Typography>
    </div>
  );
}

Title.propTypes = {
  icon: PropTypes.func,
  title: PropTypes.string,
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

Title.defaultProps = {
  icon: IoIosStar,
  title: 'Title',
  /**
   * text color variations
   */
  color: 'content1',
};

export default React.memo(Title);
