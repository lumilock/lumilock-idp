import React from 'react';
import { useSelector } from 'react-redux';
import { IoIosPerson } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { authInfoSelector } from '../../../store/auth/authSelector';
import { InputControlled } from '../../Molecules';
import { ProfileCard, TitleSection } from '../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfileIdentityForm.module.scss';

function ProfileIdentityForm() {
  // Store
  const {
    login, email, phoneNumber,
  } = useSelector(authInfoSelector);
  // React hook form
  const {
    handleSubmit, reset, control,
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
  const onSubmit = async (data, e) => {
    console.log(data, e);
  };

  return (
    <div className={styles.Root}>
      <TitleSection icon={IoIosPerson} title="Identité" variant="underlined" />
      <ProfileCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <div className={styles.InputsContainer}>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="gabriel.dupond"
              type="text"
              name="login"
              label="Login"
              size="small"
              disabled
            />
          </div>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="gabriel.dupond@lumilock.com"
              type="email"
              name="email"
              label="Email (optionel)"
              size="small"
            />
          </div>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="+33615636948"
              type="tel"
              name="phoneNumber"
              label="Téléphone portable (optionel)"
              size="small"
            />
          </div>
        </div>
      </ProfileCard>
    </div>
  );
}

export default React.memo(ProfileIdentityForm);
