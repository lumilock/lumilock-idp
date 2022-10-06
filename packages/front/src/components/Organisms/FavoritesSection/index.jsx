import React from 'react';

import { TitleSection } from '../../Cells';
import { AppLink } from '../../Molecules';
import styles from './FavoritesSection.module.scss';

function FavoritesSection() {
  const apps = Array.from({ length: 5 }, (v, k) => k);
  return (
    <div className={styles.Root}>
      <TitleSection
        color="content1"
        borderColor="background3"
        variant="underlined"
        title="Favoris"
      />
      <div className={styles.AppContainer}>
        {apps.map((index) => (
          <AppLink key={index} />
        ))}
      </div>

    </div>
  );
}

export default React.memo(FavoritesSection);
