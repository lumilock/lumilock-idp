import React from 'react';
import { IoIosBasket } from 'react-icons/io';
import { Else, If, Then } from '../../Atoms';

import { TitleSection } from '../../Cells';
import { AppLink } from '../../Molecules';
import styles from './ApplicationsSection.module.scss';

function ApplicationsSection() {
  const apps = Array.from({ length: 100 }, (v, k) => k);
  return (
    <div className={styles.Root}>
      <TitleSection
        color="content1"
        borderColor="background3"
        variant="underlined"
        title="Toutes les applications"
        icon={IoIosBasket}
      />
      <div className={styles.AppContainer}>
        <If condition={apps.length > 0}>
          <Then>
            {apps.map((index) => (
              <AppLink key={index} path="/settings" name="App name" />
            ))}
          </Then>
          <Else>
            <AppLink variant="dashed" ghost />
          </Else>
        </If>
      </div>

    </div>
  );
}

export default React.memo(ApplicationsSection);
