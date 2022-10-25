import React from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoIosClock } from 'react-icons/io';

import { authInfoSelector } from '../../../store/auth/authSelector';
import locales from '../../../assets/data/locales.json';
import timezones from '../../../assets/data/timezones.json';
import { SelectControlled } from '../../Molecules';
import { ProfileCard, TitleSection } from '../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfileTimezoneForm.module.scss';

function ProfileTimezoneForm() {
  // Store
  const {
    zoneinfo, locale,
  } = useSelector(authInfoSelector);
  // React hook form
  const {
    handleSubmit, reset, control,
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
  const onSubmit = async (data, e) => {
    console.log(data, e);
  };

  return (
    <div className={styles.Root}>
      <TitleSection icon={IoIosClock} title="Informations géographique" variant="underlined" />
      <ProfileCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <div className={styles.InputsContainer}>
          <div className={styles.InputBox}>
            <SelectControlled
              control={control}
              placeholder="--Selectionner un fuseau horaire--"
              type="text"
              name="zoneinfo"
              options={timezones}
              label="Fuseau horaire"
              size="small"
            />
          </div>
          <div className={styles.InputBox}>
            <SelectControlled
              control={control}
              placeholder="--Selectionner une langue--"
              type="text"
              options={locales}
              name="locale"
              label="Langage"
              size="small"
            />
          </div>
        </div>
      </ProfileCard>
    </div>
  );
}

export default React.memo(ProfileTimezoneForm);
