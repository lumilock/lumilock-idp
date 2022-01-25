import React from 'react';

import { InputField } from '../../../components/Form';

import styles from './LoginForm.module.scss';

function LoginForm() {
  return (
    <div className={styles.Root}>
      <form className={styles.Form} onSubmit={console.log}>
        <div>
          <h4>Bienvenue</h4>
          <p className={`${styles.Subtitle} body1`}>Bienvenue sur Lumilock</p>
        </div>
        <InputField label="Identifiant" name="identity" type="text" placeholder="Entrez votre identifiant" />
        <InputField label="Mot de passe" name="password" type="password" placeholder="Entrez votre mot de passe" />
      </form>
    </div>
  );
}

export default React.memo(LoginForm);
