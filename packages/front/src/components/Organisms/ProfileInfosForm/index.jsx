import React from 'react';
import { IoIosInformationCircle } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { InputControlled } from '../../Molecules';
import { ProfileCard, TitleSection } from '../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfileInfosForm.module.scss';

function ProfileInfosForm() {
  const {
    handleSubmit, reset, control,
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
              label="Name"
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
              label="Given Name"
              size="small"
            />
          </div>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="Léo Martin"
              type="text"
              name="middleName"
              label="Middle Name (optionel)"
              size="small"
            />
          </div>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="Dupond"
              type="text"
              name="familyName"
              label="Family Name"
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
            <InputControlled
              control={control}
              placeholder="Homme"
              type="text"
              name="gender"
              label="Sexe"
              size="small"
            />
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
