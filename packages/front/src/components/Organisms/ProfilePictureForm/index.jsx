import React from 'react';
import { IoIosImage } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { ProfileCard, TitleSection } from '../../Cells';
import { AvatarField } from '../../Molecules';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfilePictureForm.module.scss';

function ProfilePictureForm() {
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
      <TitleSection icon={IoIosImage} title="Image du profil" variant="underlined" />
      <ProfileCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <AvatarField label="File" name="file" type="file" accept="image/png, image/jpeg" />
      </ProfileCard>
    </div>
  );
}

export default React.memo(ProfilePictureForm);
