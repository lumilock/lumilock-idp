import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useEffectOnce } from '../../../services/Hooks';
import { Spinner, Typography } from '../../Electrons';

import styles from './RedirectLayout.module.scss';

function RedirectLayout({ path }) {
  // Router
  const navigate = useNavigate();

  useEffectOnce(() => {
    navigate(path);
  });

  return (
    <div className={styles.Root}>
      <Spinner size="medium" />
      <Typography variant="subtitle1" color="content1">Redirecting...</Typography>
    </div>
  );
}

RedirectLayout.propTypes = {
  /**
   * Path to follow during the redirection
   */
  path: PropTypes.string.isRequired,
};

export default React.memo(RedirectLayout);
