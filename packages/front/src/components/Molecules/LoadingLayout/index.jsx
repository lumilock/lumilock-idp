import React from 'react';
import PropTypes from 'prop-types';

import { Spinner, Typography } from '../../Electrons';
import styles from './LoadingLayout.module.scss';

function LoadingLayout({ message }) {
  return (
    <div className={styles.Root}>
      <Spinner />
      <Typography variant="subtitle1" color="content1">{message}</Typography>
    </div>
  );
}

LoadingLayout.propTypes = {
  message: PropTypes.string,
};

LoadingLayout.defaultProps = {
  message: 'Loading...',
};

export default React.memo(LoadingLayout);
