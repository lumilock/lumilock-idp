import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoIosKey } from 'react-icons/io';

import { Auth } from '../../../services/Api';
import { InputControlled } from '../../Molecules';
import { FormCard, TitleSection } from '../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfilePasswordsForm.module.scss';

function ProfilePasswordsForm() {
  const {
    handleSubmit, reset, control, setError,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: { ...defaultValues } });

  /**
   * Method used to reset all values
   */
  const handleReset = () => {
    reset({ ...defaultValues });
  };

  /**
   * Method used to send form's data to the db in order to
   * path the user profile picture
   */
  const onSubmit = async (data) => {
    await Auth.updatePassword({
      password: data?.password || null,
      newPassword: data?.newPassword || null,
      confirmedPassword: data?.confirmedPassword || null,
    })
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then(() => {
        reset({ ...defaultValues });
        // Todo success
      })
      .catch(async (err) => {
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('ERROR: [onSubmit - Auth.updatePassword]', err);
        }
        if (err.status === 400) {
          const error = await err.json();

          if (typeof error?.message === 'object' && Object.keys(error?.message)?.length > 0) {
            Object.keys(error?.message).forEach((key) => {
              setError(key, { type: 'custom', message: error?.message?.[key] });
            });
          } else {
            // Todo snackbar error
            // setErrors(error?.message);
          }
        }
        // console.log({ severity: 'error', message: 'Impossible de mettre à jour l\'image du profil.' });
      });
  };

  return (
    <div className={styles.Root}>
      <TitleSection icon={IoIosKey} title="Mot de passes" variant="underlined" />
      <FormCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <InputControlled
          control={control}
          placeholder="●●●●●●"
          type="password"
          name="password"
          label="Ancien mot de passe"
          size="small"
        />
        <InputControlled
          control={control}
          placeholder="●●●●●●●●●●●●"
          type="password"
          name="newPassword"
          label="Nouveau mot de passe"
          size="small"
        />
        <InputControlled
          control={control}
          placeholder="●●●●●●●●●●●●"
          type="password"
          name="confirmedPassword"
          label="Confirmation du mot de passe"
          size="small"
        />
      </FormCard>
    </div>
  );
}

export default React.memo(ProfilePasswordsForm);
