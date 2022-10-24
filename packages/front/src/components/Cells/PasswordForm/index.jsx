import React, { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { IoIosArrowRoundBack, IoIosCheckmark } from 'react-icons/io';

import { getAllQuery } from '../../../services/Tools';

import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './PasswordForm.module.scss';
import { If } from '../../Electrons';
import { InputControlled, Button } from '../../Atoms';
import { Alert } from '../../Molecules';
import { Auth } from '../../../services/Api';

function PasswordForm() {
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
      const { page: _, token: __, ...params } = Object?.fromEntries(paramsEntries) || {};

      setSearchParams({ ...params });
    },
    [reset, searchParams, setSearchParams],
  );

  /**
   * Method used to change the password of the current user present in the token
   * @param {object} data all form field values
   */
  const onSubmit = async (data) => {
    const token = searchParams.get('token');
    setMsg('');
    // try to reset the password
    await Auth.changePassword({ ...data, token })
      .then(async (response) => {
        if ([200, 201, 202].includes(response?.status)) {
          return response?.json();
        }
        throw new Error(response?.statusText);
      })
      .then(() => {
        setMsg({ severity: 'success', message: 'Votre mot de passe à correctement été changé' });
        // goBack(); // TODO timer
      })
      .catch((err) => {
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('ERROR: [onSubmit - Auth.changePassword]', err);
        }
        setMsg({ severity: 'error', message: 'Impossible de mettre à jour le mot de passe, la demande à expiré ou déjà été réalisé.' });
      });
  };

  return (
    <div className={styles.Root}>
      <form className={styles.Form} method="post" action="#" onSubmit={handleSubmit(onSubmit)}>
        {/* Title section */}
        <div className={styles.Header}>
          <h4>
            Nouveau
            <br />
            mot de passe

          </h4>
          <p className={`${styles.Subtitle} subtitle1`}>Choisissez un nouveau mot de passe et confirmez le.</p>
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
          label="Mot de passe*"
          name="password"
          type="password"
          placeholder="Entrez votre nouveau mot de passe"
        />
        <InputControlled
          control={control}
          label="Confirmer le mot de passe*"
          name="passwordConfirmed"
          type="password"
          placeholder="Entrez à nouveau votre mot de passe"
        />

        {/* Actions */}
        <div className={styles.Actions}>
          <Button
            color="content1"
            loading={isSubmitting}
            variant="text"
            type="button"
            onClick={goBack}
            startIcon={IoIosArrowRoundBack}
          >
            Annuler
          </Button>
          <Button
            color="content1"
            loading={isSubmitting}
            type="submit"
            endIcon={IoIosCheckmark}
          >
            Valider
          </Button>
        </div>
      </form>
    </div>
  );
}

export default React.memo(PasswordForm);
