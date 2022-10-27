import React from 'react';
import { IoIosGlobe } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';

import { Auth } from '../../../services/Api';
import { authInfoSelector } from '../../../store/auth/authSelector';
import { InputControlled } from '../../Molecules';
import { FormCard, TitleSection } from '../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfileLinksForm.module.scss';
import { updateUserPropsAction } from '../../../store/auth/authAction';

function ProfileLinksForm() {
  // Store
  const {
    profile, website,
  } = useSelector(authInfoSelector);
  const dispatch = useDispatch();
  // React hook form
  const {
    handleSubmit, reset, control, setError,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: { ...defaultValues, ...{ profile, website } } });

  /**
   * Method used to reset all values
   */
  const handleReset = () => {
    reset({ ...defaultValues, ...{ profile, website } });
  };

  /**
   * Method used to send form's data to the db in order to
   * path the user profile picture
   */
  const onSubmit = async (data) => {
    await Auth.updateLinks({
      profile: data?.profile || null,
      website: data?.website || null,
    })
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((userLinks) => {
        dispatch(updateUserPropsAction(userLinks));
        // Todo success snackbar
      })
      .catch(async (err) => {
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('ERROR: [onSubmit - Auth.updateLinks]', err);
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
      <TitleSection icon={IoIosGlobe} title="Données externes" variant="underlined" />
      <FormCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <InputControlled
          control={control}
          placeholder="https://leo-martin.com/profile"
          type="url"
          name="profile"
          label="Profil"
          size="small"
        />
        <InputControlled
          control={control}
          placeholder="https://leo-martin.com"
          type="url"
          name="website"
          label="Site web"
          size="small"
        />
      </FormCard>
    </div>
  );
}

export default React.memo(ProfileLinksForm);
