import React from 'react';
import { IoIosGlobe } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';

import { authInfoSelector } from '../../../store/auth/authSelector';
import { InputControlled } from '../../Molecules';
import { ProfileCard, TitleSection } from '../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfileLinksForm.module.scss';

function ProfileLinksForm() {
  // Store
  const {
    profile, website,
  } = useSelector(authInfoSelector);
  // React hook form
  const {
    handleSubmit, reset, control,
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
  const onSubmit = async (data, e) => {
    console.log(data, e);
  };

  return (
    <div className={styles.Root}>
      <TitleSection icon={IoIosGlobe} title="Données externes" variant="underlined" />
      <ProfileCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <div className={styles.InputsContainer}>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="https://leo-martin.com/profile"
              type="url"
              name="profile"
              label="Profil"
              size="small"
            />
          </div>
          <div className={styles.InputBox}>
            <InputControlled
              control={control}
              placeholder="https://leo-martin.com"
              type="url"
              name="website"
              label="Site web"
              size="small"
            />
          </div>
        </div>
      </ProfileCard>
    </div>
  );
}

export default React.memo(ProfileLinksForm);
