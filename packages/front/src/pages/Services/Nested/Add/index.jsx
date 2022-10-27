import React from 'react';
import { IoIosConstruct } from 'react-icons/io';

import { HeaderWrapper } from '../../../../components/Species';
import styles from './Add.module.scss';

function Add() {
  return (
    <HeaderWrapper icon={IoIosConstruct} title="Création d'un service">
      <div className={styles.Root} />
    </HeaderWrapper>
  );
}

export default React.memo(Add);
