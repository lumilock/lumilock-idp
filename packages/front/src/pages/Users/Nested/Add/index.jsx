import React from 'react';
import { IoIosPersonAdd } from 'react-icons/io';
import { IoIdCardSharp } from 'react-icons/io5';

import { TitleSection } from '../../../../components/Cells';
import { UsersAddForm } from '../../../../components/Organisms';
import { HeaderWrapper } from '../../../../components/Species';
import styles from './Add.module.scss';

function Add() {
  return (
    <HeaderWrapper icon={IoIosPersonAdd} title="Création d'un utilisateur">
      <div className={styles.Root}>
        <TitleSection icon={IoIdCardSharp} title="Informations de l'utilisateur" variant="underlined" />
        <UsersAddForm />
      </div>
    </HeaderWrapper>
  );
}

export default React.memo(Add);
