import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useEffectOnce } from '../../../services/Hooks';

import styles from './RedirectLayout.module.scss';

function RedirectLayout({ path }) {
  // Router
  const navigate = useNavigate();

  useEffectOnce(() => {
    navigate(path);
  });

  return (
    <div className={styles.Root}>
      <h3>Redirecting...</h3>
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
