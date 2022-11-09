import React from 'react';
import PropTypes from 'prop-types';

import { colors } from '../../../services/Theme';
import { Spinner, Typography } from '../../Electrons';
import styles from './LoadingLayout.module.scss';

function LoadingLayout({ message, color }) {
  return (
    <div className={styles.Root}>
      <Spinner size="medium" color={color} />
      <Typography variant="subtitle1" color={color}>{message}</Typography>
    </div>
  );
}

LoadingLayout.propTypes = {
  message: PropTypes.string,
  color: PropTypes.oneOf(colors),
};

LoadingLayout.defaultProps = {
  message: 'Loading...',
  color: 'content1',
};

export default React.memo(LoadingLayout);
