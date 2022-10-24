import React from 'react';
import { IoIosHelpCircle } from 'react-icons/io';
import { TitleSection } from '../../Cells';

import styles from './ProfileOtherInfos.module.scss';

function ProfileOtherInfos() {
  return (
    <div className={styles.Root}>
      <TitleSection icon={IoIosHelpCircle} title="Informations Complémentaires" variant="underlined" />
      <h1>ProfileOtherInfos</h1>
    </div>
  );
}

export default React.memo(ProfileOtherInfos);
