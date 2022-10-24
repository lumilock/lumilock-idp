import React, { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoIosArrowRoundBack, IoIosSend } from 'react-icons/io';

import { If } from '../../Electrons';
import { InputControlled } from '../../Atoms';
import { Alert, Button } from '../../Molecules';

import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ResetPassword.module.scss';
import { getAllQuery } from '../../../services/Tools';
import { Auth } from '../../../services/Api';

function ResetPassword() {
  // Router
  const [searchParams, setSearchParams] = useSearchParams();
  // React hook form
  const {
    handleSubmit, control, formState: { isSubmitting }, reset,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues });
  // States
  const [msg, setMsg] = useState({ severity: 'error', message: '' });

  /**
   * Method used to leave the resetPassword Form
   * so we clean all forms fields and clear the reset searchParam
   */
  const goBack = useCallback(
    () => {
      reset({ ...defaultValues });
      // Change the url params, removing {reset: true}
      const paramsEntries = getAllQuery(searchParams);
      const { page: _, ...params } = Object?.fromEntries(paramsEntries) || {};

      setSearchParams({ ...params });
    },
    [reset, searchParams, setSearchParams],
  );

  /**
   * Method used to send an reset email to the current user
   * @param {object} data all form field values
   */
  const onSubmit = async (data) => {
    // try to reset the password
    await Auth.reset({ identity: data?.resetIdentity })
      .then(async (response) => {
        if ([200, 201, 202].includes(response?.status)) {
          return response?.json();
        }
        if (response?.status === 204) {
          throw new Error('NO_CONTENT');
        } else if (response?.status === 400) {
          throw new Error('BAD_REQUEST');
        } else {
          throw new Error(response?.statusText);
        }
      })
      .then((response) => {
        setMsg({ severity: 'success', message: `Un email à été envoyé à l'adresse: "${response}"` });
      })
      .catch((err) => {
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('ERROR: [onSubmit - Auth.reset]', err);
        }
        if (err?.message === 'NO_CONTENT') {
          setMsg({ severity: 'error', message: `L'utilisateur "${data?.resetIdentity}" n'a pas d'email associé à son compte, veuillez contacter un administrateur.` });
        } else if (err?.message === 'BAD_REQUEST') {
          setMsg({ severity: 'error', message: `Aucun utilisateur n'est associé à cette identité : "${data?.resetIdentity}".` });
        }
      });
  };

  return (
    <div className={styles.Root}>
      <form className={styles.Form} method="post" action="#" onSubmit={handleSubmit(onSubmit)}>
        {/* Title section */}
        <div className={styles.Header}>
          <h4>Réinitialisation</h4>
          <p className={`${styles.Subtitle} subtitle1`}>Vous avez oublié votre mot de passe ?</p>
        </div>
        <If condition={!!msg?.message}>
          <Alert
            severity={msg?.severity}
            variant="rounded"
            title={msg?.severity === 'error' ? 'Erreur:' : 'Succès:'}
          >
            {msg?.message}
          </Alert>
        </If>

        {/* Fields */}
        <InputControlled
          control={control}
          label="Identifiant*"
          name="resetIdentity"
          type="text"
          placeholder="Entrez votre identifiant"
        />

        {/* Info */}
        <div className={styles.Disclaimer}>
          <p className="subtitle1">
            Pour récupérer votre compte
          </p>
          <p className="body2">
            Entrez l&apos;identifiant associée à votre compte
            et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            Si vous n&apos;avez pas de compte, contactez un administrateur.
          </p>
        </div>

        {/* Actions */}
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
            endIcon={IoIosSend}
          >
            Envoyer
          </Button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(ResetPassword);
