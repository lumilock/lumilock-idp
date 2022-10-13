import React, { useCallback, useContext } from 'react';

import ServicesContext from '../../../pages/Services/ServicesContext';
import { Clients } from '../../../services/Api';
import { useEffectOnce, useRequestStates } from '../../../services/Hooks';
import {
  Choose, OtherWise, Typography, When,
} from '../../Atoms';
import { ServiceButton } from '../../Cells';
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
  // Context
  const {
    selected, setSelected,
  } = useContext(ServicesContext);

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
          setApps([...response] || []);
          setSuccess('Apps has been correctly loaded');
          setLoading(false);
        }).catch((err) => {
          if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('ERROR: [fetchServices - Clients.services]', err);
          }
          setApps([]);
          setErrors('Impossible de charger les applications');
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
            {Array.from({ length: 3 }, (v) => v).map((value) => (
              <ServiceButton
                key={value}
                disabled
                loading
              />
            ))}
          </When>
          <When condition={!!errors}>
            <Typography color="alert">{errors}</Typography>
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
