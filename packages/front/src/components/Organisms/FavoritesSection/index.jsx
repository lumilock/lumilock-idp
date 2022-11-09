import React from 'react';
import { IoIosStar } from 'react-icons/io';

import { Else, If, Then } from '../../Electrons';
import { TitleSection } from '../../Cells';
import { AppLink } from '../../Molecules';
import styles from './FavoritesSection.module.scss';

function FavoritesSection() {
  const apps = Array.from({ length: 0 }, (v, k) => k);
  return (
    <div className={styles.Root}>
      <TitleSection
        color="content1"
        borderColor="background3"
        variant="underlined"
        title="Favoris"
      />
      <div className={styles.AppContainer}>
        <If condition={apps.length > 0}>
          <Then>
            {apps.map((index) => (
              <AppLink key={index} path="/settings" />
            ))}
          </Then>
          <Else>
            <AppLink icon={IoIosStar} variant="dashed" ghost />
          </Else>
        </If>
      </div>

    </div>
  );
}

export default React.memo(FavoritesSection);
