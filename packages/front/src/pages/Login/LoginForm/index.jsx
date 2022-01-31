import React from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import Button from '../../../components/Button';
import { CheckboxControlled, InputControlled } from '../../../components/Form';
import { Auth } from '../../../services/Api';

import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './LoginForm.module.scss';

function LoginForm() {
  // React hook form
  const {
    handleSubmit, control,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues });
  // Function to submit values
  const onSubmit = async (data) => {
    await Auth.login(data)
      .then((res) => console.log('res:', res))
      .catch((err) => console.log('err:', err));
    console.log(data);
  };

  return (
    <div className={styles.Root}>
      <form className={styles.Form} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h4>Bienvenue</h4>
          <p className={`${styles.Subtitle} body1`}>Bienvenue sur Lumilock</p>
        </div>
        <InputControlled control={control} label="Identifiant" name="identity" type="text" placeholder="Entrez votre identifiant" />
        <InputControlled control={control} label="Mot de passe" name="password" type="password" placeholder="Entrez votre mot de passe" />
        <CheckboxControlled control={control} label="Rester connecter pendant 30j" name="remember" />
        <a href="/#" className={`${styles.Link} body2`}>Mot de passe oublier ?</a>
        <Button color="secondary" type="submit">Se connecter</Button>
      </form>
    </div>
  );
}

export default React.memo(LoginForm);
