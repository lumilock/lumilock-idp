import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoIosClock } from 'react-icons/io';

import { Auth } from '../../../services/Api';
import { authInfoSelector } from '../../../store/auth/authSelector';
import locales from '../../../assets/data/locales.json';
import timezones from '../../../assets/data/timezones.json';
import { SelectControlled } from '../../Molecules';
import { FormCard, TitleSection } from '../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfileTimezoneForm.module.scss';
import { updateUserPropsAction } from '../../../store/auth/authAction';

function ProfileTimezoneForm() {
  // Store
  const {
    zoneinfo, locale,
  } = useSelector(authInfoSelector);
  const dispatch = useDispatch();
  // React hook form
  const {
    handleSubmit, reset, control, setError,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: { ...defaultValues, ...{ zoneinfo, locale } } });

  /**
   * Method used to reset all values
   */
  const handleReset = () => {
    reset({ ...defaultValues, ...{ zoneinfo, locale } });
  };

  /**
   * Method used to send form's data to the db in order to
   * path the user profile picture
   */
  const onSubmit = async (data) => {
    await Auth.updateGeoData({
      zoneinfo: data?.zoneinfo || null,
      locale: data?.locale || null,
    })
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((userGeoData) => {
        dispatch(updateUserPropsAction(userGeoData));
        // Todo success snackbar
      })
      .catch(async (err) => {
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('ERROR: [onSubmit - Auth.updateTimezone]', err);
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
      <TitleSection icon={IoIosClock} title="Informations géographique" variant="underlined" />
      <FormCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <SelectControlled
          control={control}
          placeholder="--Selectionner un fuseau horaire--"
          type="text"
          name="zoneinfo"
          options={timezones}
          label="Fuseau horaire"
          size="small"
        />
        <SelectControlled
          control={control}
          placeholder="--Selectionner une langue--"
          type="text"
          options={locales}
          name="locale"
          label="Langage"
          size="small"
        />
      </FormCard>
    </div>
  );
}

export default React.memo(ProfileTimezoneForm);
