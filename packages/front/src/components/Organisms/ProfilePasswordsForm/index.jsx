import React from 'react';
import { IoIosKey } from 'react-icons/io';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { ProfileCard, TitleSection } from '../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfilePasswordsForm.module.scss';
import { InputControlled } from '../../Molecules';

function ProfilePasswordsForm() {
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
      <TitleSection icon={IoIosKey} title="Mot de passes" variant="underlined" />
      <ProfileCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <div className={styles.InputsContainer}>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="●●●●●●"
              type="password"
              name="oldPassword"
              label="Ancien mot de passe"
              size="small"
            />
          </div>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="●●●●●●●●●●●●"
              type="password"
              name="password"
              label="Nouveau mot de passe"
              size="small"
            />
          </div>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="●●●●●●●●●●●●"
              type="password"
              name="confirmedPassword"
              label="Confirmation du mot de passe"
              size="small"
            />
          </div>
        </div>
      </ProfileCard>
    </div>
  );
}

export default React.memo(ProfilePasswordsForm);
