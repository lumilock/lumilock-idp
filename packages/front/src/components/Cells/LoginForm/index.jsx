import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSearchParams } from 'react-router-dom';

import { IoIosArrowRoundForward } from 'react-icons/io';
import { Alert, Button } from '../../Molecules';
import { InputControlled } from '../../Atoms/Form';
import { Auth } from '../../../services/Api';
import If from '../../Atoms/If';

import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import Logo from '../../../assets/images/Logo.svg';
import styles from './LoginForm.module.scss';

function LoginForm({ setConsent }) {
  // Router
  const [searchParams] = useSearchParams();
  // React hook form
  const {
    handleSubmit, control, formState: { isSubmitting },
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues });
  // States
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Method to retreave all searchParams from the current address
   * @returns {string[]} all searchParams from the current address
   */
  const getAllQuery = () => {
    // save the iterator
    const queryEntries = searchParams.entries();
    // select first entry
    let iterator = queryEntries.next();
    // init return array
    const querys = [];
    // init max iter counter
    let countOut = 0;
    while (iterator.done === false && countOut < 50) {
      querys.push(iterator.value);
      iterator = queryEntries.next();
      countOut += 1;
    }
    return querys;
  };

  const onSubmit = async (data) => {
    // try to loggin in
    await Auth.login(data, getAllQuery())
      .then(async (response) => {
        if ([200, 201, 202, 301, 302].includes(response?.status)) {
          if (response.redirected && response.url) {
            // data.redirect contains the string URL to redirect to
            window.history.back();
          }
          return response?.json();
        }
        if (response?.status === 401) {
          throw new Error('UNAUTHORIZED');
        } else {
          throw new Error(response?.statusText);
        }
      })
      .then((response) => {
        setErrorMsg('');
        // eslint-disable-next-line no-console
        console.log('response', response);
        // if success but need consent for relaying party
        if (response?.error === 'consent_required') {
          setConsent({ ...data, consent: false, clientInfos: response?.clientInfos });
        }
      })
      .catch((err) => {
        if (err?.message === 'UNAUTHORIZED') {
          setErrorMsg('Veuillez vous assurer de ne pas avoir fait d\'erreurs dans votre identifiant ou votre mot de passe.');
        }
        if (process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('ERROR: [onSubmit - Auth.login]', err);
        }
      });
  };

  return (
    <div className={styles.Root}>
      <form className={styles.Form} method="post" action="#" onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className={styles.Header}>
          <img src={Logo} alt="Lumilock logo" />
          <h4>Bienvenue</h4>
          <p className={`${styles.Subtitle} subtitle1`}>Identifiez vous sur votre espace professionnel</p>
        </div>
        <If condition={!!errorMsg}>
          <Alert severity="error" variant="rounded" title="Erreur:">{errorMsg}</Alert>
        </If>
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
        <Button
          color="black"
          loading={isSubmitting}
          type="submit"
          endIcon={IoIosArrowRoundForward}
        >
          Se connecter
        </Button>
        <a href="/#" className={`${styles.Link} body2`}>Mot de passe oublier ?</a>

      </form>
    </div>
  );
}

LoginForm.propTypes = {
  setConsent: PropTypes.func,
};

LoginForm.defaultProps = {
  setConsent: undefined,
};

export default React.memo(LoginForm);
