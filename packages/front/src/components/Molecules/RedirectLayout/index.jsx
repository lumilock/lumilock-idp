import React from 'react';

import styles from './RedirectLayout.module.scss';

function RedirectLayout() {
  return (
    <div className={styles.Root}>
      <h3>Redirecting...</h3>
    </div>
  );
}

export default React.memo(RedirectLayout);
