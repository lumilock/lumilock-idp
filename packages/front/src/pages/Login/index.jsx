import React from 'react';

import LoginForm from './LoginForm';
import LoginCanvas from './LoginCanvas';

import styles from './Login.module.scss';

/**
 * Component that manage the page login
 */
function Login() {
  return (
    <div className={styles.Root}>
      <LoginForm />
      <LoginCanvas />
    </div>
  );
}

export default React.memo(Login);
