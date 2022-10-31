import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosPerson } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { authInfoSelector } from '../../../../store/auth/authSelector';
import { Auth } from '../../../../services/Api';
import { InputControlled } from '../../../Molecules';
import { FormCard, TitleSection } from '../../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfileIdentityForm.module.scss';
import { updateUserPropsAction } from '../../../../store/auth/authAction';

function ProfileIdentityForm() {
  // Store
  const {
    login, email, phoneNumber,
  } = useSelector(authInfoSelector);
  const dispatch = useDispatch();
  // React hook form
  const {
    handleSubmit, reset, control, setError,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: { ...defaultValues, ...{ login, email, phoneNumber } } });

  /**
   * Method used to reset all values
   */
  const handleReset = () => {
    reset({ ...defaultValues, ...{ login, email, phoneNumber } });
  };

  /**
   * Method used to send form's data to the db in order to
   * path the user profile picture
   */
  const onSubmit = async (data) => {
    await Auth.updateIdentity({
      email: data?.email || null,
      phoneNumber: data?.phoneNumber || null,
    })
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((userIdentity) => {
        dispatch(updateUserPropsAction(userIdentity));
      })
      .catch(async (err) => {
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('ERROR: [onSubmit - Auth.updateIdentity]', err);
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
      <TitleSection icon={IoIosPerson} title="Identité" variant="underlined" />
      <FormCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <InputControlled
          control={control}
          placeholder="gabriel.dupond"
          type="text"
          name="login"
          label="Login"
          size="small"
          disabled
        />
        <InputControlled
          control={control}
          placeholder="gabriel.dupond@lumilock.com"
          type="email"
          name="email"
          label="Email (optionel)"
          size="small"
        />
        <InputControlled
          control={control}
          placeholder="+33615636948"
          type="tel"
          name="phoneNumber"
          label="Téléphone portable (optionel)"
          size="small"
        />
      </FormCard>
    </div>
  );
}

export default React.memo(ProfileIdentityForm);
