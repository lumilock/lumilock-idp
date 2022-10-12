import React, { useCallback, useState } from 'react';

import { Clients } from '../../../services/Api';
import { useEffectOnce, useRequestStates } from '../../../services/Hooks';
import { Choose, OtherWise, When } from '../../Atoms';
import { ServiceButton } from '../../Molecules';
import styles from './ServicesSection.module.scss';

function ServicesSection() {
  const [
    apps,
    errors,
    success,
    loading,
    setApps,
    setErrors,
    setSuccess,
    setLoading,
  ] = useRequestStates([]);
  const [selected, setSelected] = useState('');

  const fetchServices = useCallback(
    async () => {
      setErrors('');
      setSuccess('');
      setLoading(true);
      await Clients.services()
        .then(async (response) => {
          if ([200].includes(response?.status)) {
            return response?.json();
          }
          throw new Error(response?.statusText);
        }).then((response) => {
          setApps(response || []);
          setSuccess('Apps has been correctly loaded');
          setLoading(false);
        }).catch((err) => {
          if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('ERROR: [fetchServices - Clients.services]', err);
          }
          setApps([]);
          setErrors('Impossible to load applications');
          setLoading(false);
        });
    },
    [setApps, setErrors, setLoading, setSuccess],
  );

  useEffectOnce(() => {
    fetchServices();
  });

  return (
    <div className={styles.Root}>
      <div className={styles.ServicesContainer}>
        <Choose>
          <When condition={!!loading}>
            <p>loading</p>
          </When>
          <When condition={!!errors}>
            <p>errors</p>
          </When>
          <When condition={!!success && apps.length > 0}>
            {apps.map((app) => (
              <ServiceButton
                key={app?.id}
                id={app?.id}
                image={app?.logoUri}
                name={app?.clientName}
                selected={app?.id === selected}
                setSelected={setSelected}
              />
            ))}
          </When>
          <OtherWise>
            <p>No apps</p>
          </OtherWise>
        </Choose>
      </div>
    </div>

  );
}

export default React.memo(ServicesSection);
