import React from 'react';

import { AnimatedBackground, ErrorBoundary, LoginForms } from '../../components';
import styles from './Login.module.scss';

/**
 * Component that manage the page login
 */
function Login() {
  return (
    <div className={styles.Root}>
      <div className={styles.Form}>
        <ErrorBoundary>
          <LoginForms />
        </ErrorBoundary>
      </div>
      <div className={styles.Background}>
        <ErrorBoundary>
          <AnimatedBackground ballsNumber={8} />
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default React.memo(Login);
