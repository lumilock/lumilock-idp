import React, { useCallback } from 'react';

import { Clients } from '../../../services/Api';
import { useEffectOnce } from '../../../services/Hooks';
import { ServiceButton } from '../../Molecules';
import styles from './ServicesSection.module.scss';

function ServicesSection() {
  const apps = Array.from({ length: 100 }, (v, k) => k);

  const fetchServices = useCallback(
    async () => {
      await Clients.services()
        .then(async (response) => {
          if ([200].includes(response?.status)) {
            return response?.json();
          }
          throw new Error(response?.statusText);
        }).then((response) => {
          console.log('response', response);
        }).catch((err) => {
          if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('ERROR: [fetchServices - Clients.services]', err);
          }
        });
    },
    [],
  );

  useEffectOnce(() => {
    fetchServices();
  });

  return (
    <div className={styles.Root}>
      <div className={styles.ServicesContainer}>
        {apps.map((index) => (
          <ServiceButton key={index} />
        ))}
      </div>
    </div>

  );
}

export default React.memo(ServicesSection);
