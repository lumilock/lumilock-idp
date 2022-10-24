import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosImage } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { ProfileCard, TitleSection } from '../../Cells';
import { AvatarControlled } from '../../Molecules';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfilePictureForm.module.scss';
import { Auth } from '../../../services/Api';
import { updateUserPropsAction } from '../../../store/auth/authAction';
import { authInfoSelector } from '../../../store/auth/authSelector';

function ProfilePictureForm() {
  // Store
  const dispatch = useDispatch();
  const { picture: initialPicture } = useSelector(authInfoSelector);
  // React hook form
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
    const formData = new FormData();
    formData.append('file', e?.target?.file?.files?.[0]);
    await Auth.updatePicture(formData)
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((picture) => {
        dispatch(updateUserPropsAction(picture));
      })
      .catch((err) => {
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('ERROR: [onSubmit - Auth.updatePicture]', err);
        }
        console.log({ severity: 'error', message: 'Impossible de mettre à jour l\'image du profil.' });
      });
  };

  return (
    <div className={styles.Root}>
      <TitleSection icon={IoIosImage} title="Image du profil" variant="underlined" />
      <ProfileCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <div className={styles.FieldContainer}>
          <AvatarControlled
            control={control}
            name="file"
            type="file"
            accept="image/png, image/jpeg"
            initialPicture={initialPicture}
          />
        </div>
      </ProfileCard>
    </div>
  );
}

export default React.memo(ProfilePictureForm);
