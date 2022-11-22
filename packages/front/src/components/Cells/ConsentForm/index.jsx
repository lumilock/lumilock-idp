import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoIosArrowRoundBack, IoIosCheckmark } from 'react-icons/io';

import { IoIdCardSharp } from 'react-icons/io5';
import { Auth } from '../../../services/Api';
import { getAllQuery } from '../../../services/Tools';
import {
  If, Icon, Typography,
} from '../../Electrons';
import {
  Squircle, Button,
} from '../../Atoms';
import { Alert, CheckboxControlled } from '../../Molecules';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';

import styles from './ConsentForm.module.scss';

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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    // try to loggin in with consent
    await Auth.login({ identity, password, consent }, getAllQuery(searchParams))
      .then(async (response) => {
        if ([200, 201, 202, 301, 302].includes(response?.status)) {
          if (response.redirected && response.url) {
            // data.redirect contains the string URL to redirect to
            window.history.go(-2);
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
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('SUCCESS: [onSubmit - Auth.login]', response);
        }
        if (response) {
          setLoading(false);
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
      <form className={styles.Form} method="post" onSubmit={handleSubmit(onSubmit)}>
        {/* Title section */}
        <div className={styles.Header}>
          <Typography variant="h2">Consentement</Typography>
          <Typography variant="subtitle1" color="content3">Une application tierce requiert votre consentement.</Typography>
        </div>
        <If condition={!!errorMsg}>
          <Alert severity="error" variant="rounded" title="Erreur:">{errorMsg}</Alert>
        </If>

        {/* App section */}
        <div className={styles.AppSection}>
          <div className={styles.AppIcon}>
            <Squircle image={clientInfos?.logoUri || ''} size="large" />
          </div>
          <div className={styles.Infos}>
            <Typography variant="h3" color="content1">{clientInfos?.clientName}</Typography>
            <Typography variant="body2" color="content3">Demande votre autorisation.</Typography>
          </div>
        </div>

        {/* Sharing data scition */}
        <div className={styles.SharingSection}>
          <Typography variant="subtitle1">Données partagées:</Typography>
          <ul className={styles.SharingItem}>
            <li>
              <Icon
                ionIcon={IoIdCardSharp}
                size="small"
                color="content3"
              />
              <Typography variant="body2" color="content3">Toutes les informations du profil</Typography>
            </li>
          </ul>
        </div>
        <CheckboxControlled control={control} label="J'accepte de partager ces données" name="consent" />
        {/* Info */}
        <div className={styles.Disclaimer}>
          <Typography variant="subtitle1">
            Assurez-vous de connaître
            {' '}
            <strong>{clientInfos?.clientName}</strong>
          </Typography>
          <Typography variant="body2" color="content3">
            Vous partagez peut-être des informations sensibles avec ce site ou cette application.
            Mais vous pourrez désactiver le partage de données dans les paramètres de votre profil.
          </Typography>
        </div>
        <div className={styles.Actions}>
          <Button
            color="alert dark"
            loading={isSubmitting || loading}
            variant="text"
            type="button"
            onClick={goBack}
            startIcon={IoIosArrowRoundBack}
          >
            Annuler
          </Button>
          <Button
            color="content1"
            loading={isSubmitting || loading}
            type="submit"
            startIcon={IoIosCheckmark}
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
