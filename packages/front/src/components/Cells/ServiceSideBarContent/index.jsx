import React, { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoIosArchive, IoIosCheckmark, IoIosClose, IoIosCreate, IoIosEye, IoIosEyeOff,
} from 'react-icons/io';

import ServicesContext from '../../../pages/Services/ServicesContext';
import { Clients } from '../../../services/Api';
import { useEffectOnce, useRequestStates, useUpdate } from '../../../services/Hooks';
import {
  Else, Icon, If, Then, Typography,
} from '../../Electrons';
import { Button, LabeledText, ServiceProfile } from '../../Molecules';
import styles from './ServiceSideBarContent.module.scss';

function ServiceSideBarContent() {
  // Context
  const { selected } = useContext(ServicesContext);
  // Router
  const navigate = useNavigate();
  // Request states
  const {
    data: service,
    errors,
    loading,
    setData: setService,
    setErrors,
    setLoading,
  } = useRequestStates(null);

  const getFormattedDate = (date) => new Date(date).toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  const handleClick = (id) => {
    navigate(`${id}`);
  };

  const fetchService = useCallback(
    async () => {
      setErrors('');
      setLoading(true);
      await Clients.getById(selected)
        .then(async (response) => {
          if ([200].includes(response?.status)) {
            return response?.json();
          }
          throw new Error(response?.statusText);
        }).then((response) => {
          setService(response || null);
          setLoading(false);
        }).catch((err) => {
          if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('ERROR: [fetchService - Clients.getById]', err);
          }
          setService(null);
          setErrors('Impossible de charger cette application.');
          setLoading(false);
        });
    },
    [selected, setErrors, setLoading, setService],
  );

  // On updated
  useUpdate(() => {
    if (selected) {
      fetchService(selected);
    }
  }, [selected]);

  // On Mounted
  useEffectOnce(() => {
    if (selected) {
      fetchService(selected);
    }
  });

  return (
    <div className={styles.Root}>
      <If condition={!errors}>
        <Then>
          <ServiceProfile
            loading={loading}
            image={service?.logoUri}
            title={service?.clientName}
            subtitle={service?.id}
            subtitleColor="content3"
          />
          <Button startIcon={IoIosCreate} color="black" onClick={() => handleClick(service?.id)}>Éditer</Button>
          <div className={styles.States}>
            <Icon
              loading={loading}
              size="small"
              ionIcon={service?.isActive ? IoIosCheckmark : IoIosClose}
              color={service?.isActive ? 'main' : 'alert dark'}
              title={service?.isActive ? 'Actif' : 'Inactif'}
            />
            <Icon
              loading={loading}
              size="small"
              ionIcon={IoIosArchive}
              color={service?.isArchive ? 'alert dark' : 'main'}
              title={service?.isArchive ? 'Archivé' : 'Non archivé'}
            />
            <Icon
              loading={loading}
              size="small"
              ionIcon={service?.hide ? IoIosEyeOff : IoIosEye}
              color={service?.hide ? 'alert dark' : 'main'}
              title={service?.hide ? 'Caché' : 'Non caché'}
            />
          </div>
          <div className={styles.Fields}>
            <LabeledText loading={loading} label="Type d'application" text={service?.applicationType} />
            <LabeledText loading={loading} label="Type d'application" text={service?.redirectUris} />
            <LabeledText loading={loading} label="Url de l'application" text={service?.appUrl} />
            <LabeledText loading={loading} label="Permissions" text={service?.permissions} />
            <LabeledText loading={loading} label="Date d'installation" text={getFormattedDate(service?.createDateTime)} />
            <LabeledText loading={loading} label="Date de dernière mise à jour" text={getFormattedDate(service?.lastChangedDateTime)} />
          </div>
        </Then>
        <Else>
          <Typography color="alert">{errors}</Typography>
        </Else>
      </If>
    </div>
  );
}

export default React.memo(ServiceSideBarContent);
