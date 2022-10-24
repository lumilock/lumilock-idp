import React, { useCallback } from 'react';
import { IoIosBasket } from 'react-icons/io';

import { Clients } from '../../../services/Api';
import { useEffectOnce, useRequestStates } from '../../../services/Hooks';
import { Else, If, Then } from '../../Electrons';
import { AppLink } from '../../Molecules';
import { TitleSection } from '../../Cells';
import styles from './ApplicationsSection.module.scss';

function ApplicationsSection() {
  // Request states
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

  console.log('apps=', apps, 'errors=', errors, 'success=', success, 'loading=', loading);

  const fetchApps = useCallback(
    async () => {
      setErrors('');
      setSuccess('');
      setLoading(true);
      await Clients.apps()
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
            console.error('ERROR: [fetchApps - Clients.apps]', err);
          }
          setApps([]);
          setErrors('Impossible de charger les applications');
          setLoading(false);
        });
    },
    [setApps, setErrors, setLoading, setSuccess],
  );

  // On mounted
  useEffectOnce(() => {
    fetchApps();
  });

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
            {apps.map((app) => (
              <AppLink
                key={app?.id}
                path={app?.appUrl}
                target="_blank"
                picture={app?.logoUri}
                name={app?.clientName}
              />
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
