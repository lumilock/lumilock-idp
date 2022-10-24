import React from 'react';
import { IoIosGlobe } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { ProfileCard, TitleSection } from '../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfileLinksForm.module.scss';

function ProfileLinksForm() {
  const {
    handleSubmit, reset,
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
      <TitleSection icon={IoIosGlobe} title="Données externes" variant="underlined" />
      <ProfileCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <h1>ProfileLinksForm</h1>
      </ProfileCard>
    </div>
  );
}

export default React.memo(ProfileLinksForm);
