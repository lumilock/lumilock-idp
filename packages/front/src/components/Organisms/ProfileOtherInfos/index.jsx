import React from 'react';
import clsx from 'clsx';
import { IoIosHelpCircle } from 'react-icons/io';
import { useSelector } from 'react-redux';

import { authInfoSelector } from '../../../store/auth/authSelector';
import { Typography } from '../../Electrons';
import { TitleSection } from '../../Cells';
import styles from './ProfileOtherInfos.module.scss';

const OPTIONS = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

function ProfileOtherInfos() {
  // Store
  const {
    isActive, isArchived, createDateTime, lastChangedDateTime,
  } = useSelector(authInfoSelector);

  const FormattedDate = (date) => new Date(date).toLocaleString(undefined, OPTIONS);

  return (
    <div className={styles.Root}>
      <TitleSection icon={IoIosHelpCircle} title="Informations Complémentaires" variant="underlined" />
      <div className={styles.InfosContainer}>
        <Typography varian="subtitle1" color="content3">
          {clsx('Date de création du compte :', FormattedDate(createDateTime))}
        </Typography>
        <Typography varian="subtitle1" color="content3">
          {clsx('Date de création du compte :', FormattedDate(lastChangedDateTime))}
        </Typography>
        <Typography varian="subtitle1" color="content3">
          {isActive ? 'Le compte est actif' : 'Le compte n\'est pas actif'}
        </Typography>
        <Typography varian="subtitle1" color="content3">
          {isArchived ? 'Le compte est archivé' : 'Le compte n\'est pas archivé'}
        </Typography>
      </div>
    </div>
  );
}

export default React.memo(ProfileOtherInfos);
