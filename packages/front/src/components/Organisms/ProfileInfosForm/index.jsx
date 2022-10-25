import React from 'react';
import { IoIosInformationCircle } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useSelector } from 'react-redux';
import { InputControlled, RadioControlled } from '../../Molecules';
import { ProfileCard, TitleSection } from '../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfileInfosForm.module.scss';
import { Typography } from '../../Electrons';
import { authInfoSelector } from '../../../store/auth/authSelector';

function ProfileInfosForm() {
  // Store
  const {
    familyName, gender, birthdate, givenName, middleName, name, nickname,
  } = useSelector(authInfoSelector);
  // React hook form
  const {
    handleSubmit, reset, control,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...defaultValues,
      ...{
        familyName, gender, birthdate, givenName, middleName, name, nickname,
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
        familyName, gender, birthdate, givenName, middleName, name, nickname,
      },
    });
  };

  /**
   * Method used to send form's data to the db in order to
   * path the user profile picture
   */
  const onSubmit = async (data, e) => {
    console.log(data, e);
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
