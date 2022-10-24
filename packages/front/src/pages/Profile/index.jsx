import React from 'react';
import { IoIosPerson } from 'react-icons/io';
import {
  ProfileIdentityForm, ProfileInfosForm, ProfileLinksForm, ProfileOtherInfos, ProfilePasswordsForm, ProfilePictureForm, ProfileTimezoneForm,
} from '../../components/Organisms';

import { HeaderWrapper } from '../../components/Species';
import styles from './Profile.module.scss';

function Profile() {
  return (
    <HeaderWrapper icon={IoIosPerson} title="Profil">
      <div className={styles.Root}>
        <ProfilePictureForm />
        <ProfileInfosForm />
        <ProfileIdentityForm />
        <ProfilePasswordsForm />
        <ProfileLinksForm />
        <ProfileTimezoneForm />
        <ProfileOtherInfos />
      </div>
    </HeaderWrapper>
  );
}

export default React.memo(Profile);
