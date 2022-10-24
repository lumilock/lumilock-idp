import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoIosArrowRoundForward } from 'react-icons/io';

import { softUpdateAction } from '../../../store/auth/authAction';
import { Button } from '../../Atoms';
import { Alert } from '../../Molecules';
import { InputControlled } from '../../Atoms/Form';
import { Auth } from '../../../services/Api';
import If from '../../Electrons/If';

import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import Logo from '../../../assets/images/Logo.svg';
import styles from './LoginForm.module.scss';
import { getAllQuery } from '../../../services/Tools';

function LoginForm({ setConsent }) {
  // Router
  const [searchParams, setSearchParams] = useSearchParams();
  // Store
  const dispatch = useDispatch();
  // React hook form
  const {
    handleSubmit, control, formState: { isSubmitting },
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues });
  // States
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigateTo = useCallback(
    (page) => {
      const paramsEntries = getAllQuery(searchParams);
      const params = Object?.fromEntries(paramsEntries) || {};

      setSearchParams({ ...params, page });
    },
    [searchParams, setSearchParams],
  );

  const navigateAction = useCallback(
    (e, page) => {
      navigateTo(page);
      e.preventDefault();
      return false;
    },
    [navigateTo],
  );

  /**
   * Method used to send form information to the login api route
   * @param {object} data on fields values
   */
  const onSubmit = async (data) => {
    setLoading(true);
    // try to loggin in
    await Auth.login(data, getAllQuery(searchParams))
      .then(async (response) => {
        if ([200, 201, 202, 301, 302].includes(response?.status)) {
          if (response.redirected && response.url) {
            // data.redirect contains the string URL to redirect to
            window.history.back();
            return null;
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
        // if success but need consent for relaying party
        if (response?.error === 'consent_required') {
          setConsent({ ...data, consent: false, clientInfos: response?.clientInfos });
          navigateTo('consent');
        }
        if (response) {
          setLoading(false);
          dispatch(softUpdateAction(response?.user || null));
        }
      })
      .catch((err) => {
        if (err?.message === 'UNAUTHORIZED') {
          setErrorMsg('Veuillez vous assurer de ne pas avoir fait d\'erreurs dans votre identifiant ou votre mot de passe.');
        }
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('ERROR: [onSubmit - Auth.login]', err);
        }
        setLoading(false);
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
          label="Identifiant*"
          name="identity"
          type="text"
          placeholder="Entrez votre identifiant"
        />
        <InputControlled
          control={control}
          label="Mot de passe*"
          name="password"
          type="password"
          placeholder="Entrez votre mot de passe"
        />
        <Button
          color="content1"
          loading={isSubmitting || loading}
          type="submit"
          endIcon={IoIosArrowRoundForward}
        >
          Se connecter
        </Button>
        <a href="?reset=true" className={`${styles.Link} body2`} onClick={(e) => navigateAction(e, 'reset')}>Mot de passe oublier ?</a>
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
