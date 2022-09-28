import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useEffectOnce } from '../../../services/Hooks';

import styles from './RedirectLayout.module.scss';

function RedirectLayout() {
  // Router
  const navigate = useNavigate();

  useEffectOnce(() => {
    navigate('/applications');
  });

  return (
    <div className={styles.Root}>
      <h3>Redirecting...</h3>
    </div>
  );
}

export default React.memo(RedirectLayout);
