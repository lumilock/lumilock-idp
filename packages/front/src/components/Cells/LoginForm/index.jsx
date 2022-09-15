import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '../../Molecules';
import { InputControlled } from '../../Atoms/Form';
import Logo from '../../../assets/images/Logo.svg';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './LoginForm.module.scss';

function LoginForm() {
  // React hook form
  const {
    handleSubmit, control, formState: { isSubmitting },
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues });

  const onSubmit = async (data) => {
    // try to loggin in
    // exclude needConsent from query values
    console.log('data', data);
  };

  return (
    <div className={styles.Root}>
      <form className={styles.Form} method="post" action="#" onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className={styles.Header}>
          <img src={Logo} alt="Lumilock logo" />
          <h4>Bienvenue</h4>
          <p className={`${styles.Subtitle} subtitle1`}>Sur votre espace professionnel</p>
        </div>

        {/* Fields */}
        <InputControlled
          control={control}
          label="Identifiant"
          name="identity"
          type="text"
          placeholder="Entrez votre identifiant"
        />
        <InputControlled
          control={control}
          label="Mot de passe"
          name="password"
          type="password"
          placeholder="Entrez votre mot de passe"
        />
        <Button color="secondary" loading={isSubmitting} type="submit">Se connecter</Button>
        <a href="/#" className={`${styles.Link} body2`}>Mot de passe oublier ?</a>

      </form>
    </div>
  );
}

export default React.memo(LoginForm);
