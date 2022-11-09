import React from 'react';
import { IoIosConstruct, IoIosRocket } from 'react-icons/io';

import { ServicesAddForm } from '../../../../components/Organisms';
import { TitleSection } from '../../../../components/Cells';
import { HeaderWrapper } from '../../../../components/Species';
import styles from './Add.module.scss';

function Add() {
  return (
    <HeaderWrapper icon={IoIosConstruct} title="Création d'un service">
      <div className={styles.Root}>
        <TitleSection icon={IoIosRocket} title="Initialisation du service" variant="underlined" />
        <ServicesAddForm />
      </div>
    </HeaderWrapper>
  );
}

export default React.memo(Add);
