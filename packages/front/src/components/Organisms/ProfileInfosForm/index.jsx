import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoIosInformationCircle } from 'react-icons/io';

import { authInfoSelector } from '../../../store/auth/authSelector';
import { Auth } from '../../../services/Api';
import { toStringDate } from '../../../services/Tools';
import { Typography } from '../../Electrons';
import { InputControlled, RadioControlled } from '../../Molecules';
import { ProfileCard, TitleSection } from '../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfileInfosForm.module.scss';
import { updateUserPropsAction } from '../../../store/auth/authAction';

function ProfileInfosForm() {
  // Store
  const {
    familyName, gender, birthdate, givenName, middleName, name, nickname, preferredUsername,
  } = useSelector(authInfoSelector);
  const dispatch = useDispatch();
  // React hook form
  const {
    handleSubmit, reset, control, setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...defaultValues,
      ...{
        familyName, gender, birthdate: toStringDate(birthdate), givenName, middleName, name, nickname, preferredUsername,
      },
    },
  });

  /**
   * Method used to reset all values
   */
  const handleReset = () => {
    reset({
      ...defaultValues,
      ...{
        familyName, gender, birthdate: toStringDate(birthdate), givenName, middleName, name, nickname, preferredUsername,
      },
    });
  };

  /**
   * Method used to send form's data to the db in order to
   * path the user profile picture
   */
  const onSubmit = async (data) => {
    await Auth.updatePersonnalInfo({
      familyName: data?.familyName || null,
      gender: data?.gender || null,
      birthdate: data?.birthdate?.toISOString() || null,
      givenName: data?.givenName || null,
      middleName: data?.middleName || null,
      nickname: data?.nickname || null,
      preferredUsername: data?.preferredUsername || null,
    })
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((userInfo) => {
        dispatch(updateUserPropsAction(userInfo));
      })
      .catch(async (err) => {
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('ERROR: [onSubmit - Auth.updatePersonnalInfo]', err);
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
      <TitleSection icon={IoIosInformationCircle} title="Informations personnelles" variant="underlined" />
      <ProfileCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <div className={styles.InputsContainer}>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="Gabriel Léo Martin Dupond"
              type="text"
              name="name"
              label="Nom complet"
              size="small"
              disabled
            />
          </div>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="Gabriel"
              type="text"
              name="givenName"
              label="Prenom"
              size="small"
            />
          </div>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="Léo Martin"
              type="text"
              name="middleName"
              label="Deuxième nom (optionel)"
              size="small"
            />
          </div>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="Dupond"
              type="text"
              name="familyName"
              label="Nom de famille"
              size="small"
            />
          </div>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="Gabi Dupond"
              type="text"
              name="preferredUsername"
              label="Nom d'utilisateur (optionnel)"
              size="small"
            />
          </div>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="Gabi"
              type="text"
              name="nickname"
              label="Surnom (optionel)"
              size="small"
            />
          </div>
          <div className={styles.InputBox}>
            <Typography component="p" variant="subtitle2" color="content3">Sexe</Typography>
            <div className={styles.RadioGroup}>
              <RadioControlled
                control={control}
                name="gender"
                label="Homme"
                value="male"
                size="small"
              />
              <RadioControlled
                control={control}
                name="gender"
                label="Femme"
                value="female"
                size="small"
                hideError
              />
              <RadioControlled
                control={control}
                name="gender"
                label="Autre"
                value="other"
                size="small"
                hideError
              />
            </div>
          </div>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="15/10/1969"
              type="date"
              name="birthdate"
              label="Date de naissance"
              size="small"
            />
          </div>
        </div>
      </ProfileCard>
    </div>
  );
}

export default React.memo(ProfileInfosForm);
