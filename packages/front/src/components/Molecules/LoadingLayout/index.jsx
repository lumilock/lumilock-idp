import React from 'react';

import styles from './LoadingLayout.module.scss';

function LoadingLayout() {
  return (
    <div className={styles.Root}>
      <h3>Loading...</h3>
    </div>
  );
}

export default React.memo(LoadingLayout);
