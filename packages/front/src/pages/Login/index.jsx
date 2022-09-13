import React from 'react';

import { AnimatedBackground } from '../../components';

// import LoginForm from './LoginForm';
// import LoginCanvas from './LoginCanvas';

import styles from './Login.module.scss';

/**
 * Component that manage the page login
 */
function Login() {
  return (
    <div className={styles.Root}>
      <div className={styles.Form} />
      <div className={styles.Background}>
        <AnimatedBackground ballsNumber={10} />
      </div>
      {/* <LoginForm /> */}
      {/* <LoginCanvas /> */}
    </div>
  );
}

export default React.memo(Login);
