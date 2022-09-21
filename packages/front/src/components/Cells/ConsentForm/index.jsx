import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoIosArrowRoundBack, IoIosCheckmark, IoIosPerson } from 'react-icons/io';

import { Auth } from '../../../services/Api';
import { Alert, Button } from '../../Molecules';
import {
  Squircle, If, Else, Then, CheckboxControlled, Icon,
} from '../../Atoms';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import Logo from '../../../assets/images/Logo.svg';

import styles from './ConsentForm.module.scss';
import { getAllQuery } from '../../../services/Tools';

function ConsentForm({ values, setConsent }) {
  // Router
  const [searchParams, setSearchParams] = useSearchParams();
  // React hook form
  const {
    handleSubmit, control, formState: { isSubmitting }, watch, reset,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: values ?? defaultValues });
  const clientInfos = watch('clientInfos');
  // States
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Method used to leave the consent Form
   * so we clean all forms fields and clear the global consent object
   */
  const goBack = useCallback(
    () => {
      reset({ ...defaultValues });
      setConsent(undefined);
      // update the page value in searchParams
      const paramsEntries = getAllQuery(searchParams);
      const { reset: _, ...params } = Object?.fromEntries(paramsEntries) || {};
      setSearchParams({ ...params });
    },
    [reset, searchParams, setConsent, setSearchParams],
  );

  const onSubmit = async (data) => {
    // try to loggin in
    // exclude needConsent from query values
    const { identity, password, consent } = data;

    // try to loggin in with consent
    await Auth.login({ identity, password, consent }, getAllQuery(searchParams))
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
        goBack();
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('SUCCESS: [onSubmit - Auth.login]', response);
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
      });
  };

  return (
    <div className={styles.Root}>
      <form className={styles.Form} method="post" onSubmit={handleSubmit(onSubmit)}>
        {/* Title section */}
        <div className={styles.Header}>
          <h4>Consentement</h4>
          <p className={`${styles.Subtitle} subtitle1`}>Une application tierce requiert votre consentement.</p>
        </div>
        <If condition={!!errorMsg}>
          <Alert severity="error" variant="rounded" title="Erreur:">{errorMsg}</Alert>
        </If>

        {/* App section */}
        <div className={styles.AppSection}>
          <div className={styles.AppIcon}>
            <If>
              <Then>
                <Squircle image={clientInfos?.logoUri || ''} size="L" />
              </Then>
              <Else>
                <img src={Logo} alt="lumilock logo" />
              </Else>
            </If>
          </div>
          <div className={styles.Infos}>
            <h6>{clientInfos?.clientName}</h6>
            <p className="body2">Demande votre autorisation.</p>
          </div>
        </div>

        {/* Sharing data scition */}
        <div className={styles.SharingSection}>
          <p className="subtitle1">Données partagées:</p>
          <ul className={styles.SharingItem}>
            <li>
              <Icon
                ionIcon={IoIosPerson}
                size="small"
              />
              <p className="body2">Informations utilisateur</p>
            </li>
          </ul>
        </div>
        <CheckboxControlled control={control} label="J'accepte de partager ces données" name="consent" />
        {/* Info */}
        <div className={styles.Disclaimer}>
          <p className="subtitle1">
            Assurez-vous de connaître
            {' '}
            <strong>{clientInfos?.clientName}</strong>
          </p>
          <p className="body2">
            Vous partagez peut-être des informations sensibles avec ce site ou cette application.
            Mais vous pourrez désactiver le partage de données dans les paramètres de votre profil.
          </p>
        </div>
        <div className={styles.Actions}>
          <Button
            color="black"
            loading={isSubmitting}
            variant="standard"
            type="button"
            onClick={goBack}
            startIcon={IoIosArrowRoundBack}
          >
            Annuler
          </Button>
          <Button
            color="black"
            loading={isSubmitting}
            type="submit"
            endIcon={IoIosCheckmark}
          >
            Consentir
          </Button>
        </div>
      </form>
    </div>
  );
}

ConsentForm.propTypes = {
  setConsent: PropTypes.func,
  values: PropTypes.shape({
    identity: PropTypes.string,
    password: PropTypes.string,
    consent: PropTypes.bool,
    clientInfos: PropTypes.shape({
      id: PropTypes.string,
      appUrl: PropTypes.string,
      logoUri: PropTypes.string,
      hide: PropTypes.bool,
      clientName: PropTypes.string,
      permissions: PropTypes.arrayOf(PropTypes.string),
      redirectUris: PropTypes.arrayOf(PropTypes.string),
    }),
  }),
};

ConsentForm.defaultProps = {
  setConsent: undefined,
  values: {
    identity: '',
    password: '',
    consent: false,
    clientInfos: {
      id: '',
      appUrl: '',
      logoUri: '',
      hide: false,
      clientName: '',
      permissions: [],
      redirectUris: [],
    },
  },
};

export default React.memo(ConsentForm);
