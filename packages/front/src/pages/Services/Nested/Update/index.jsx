import React, { useCallback } from 'react';
import { IoIosConstruct, IoIosDownload, IoIosSync } from 'react-icons/io';
import { useParams } from 'react-router-dom';

import { urlToObject } from '../../../../services/Tools';
import { Clients } from '../../../../services/Api';
import { useEffectOnce, useRequestStates } from '../../../../services/Hooks';
import { Else, If, Then } from '../../../../components/Electrons';
import { Button } from '../../../../components/Atoms';
import { Alert } from '../../../../components/Molecules';
import { TitleSection } from '../../../../components/Cells';
import { ServicesUpdateForm } from '../../../../components/Organisms';
import { HeaderWrapper } from '../../../../components/Species';
import styles from './Update.module.scss';

function Update() {
  // Router
  const { serviceId } = useParams();
  // Request states
  const {
    data: client,
    errors,
    loading,
    setData: setClient,
    setErrors,
    setLoading,
  } = useRequestStates();

  /**
   * Call the service api to register it
   */
  const registerClient = useCallback(async (url) => {
    setLoading(true);
    setErrors('');
    await Clients.register(url)
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then(async (clientData) => {
        if (clientData?.logoUri) {
          const splittedUri = clientData?.logoUri?.split('/');
          const file = await urlToObject(clientData?.logoUri, splittedUri?.[(splittedUri?.length || 0) - 1]);
          setClient({ ...clientData, file });
        } else {
          setClient(clientData);
        }
        setLoading(false);
        // Todo success snackbar
      })
      .catch(async (err) => {
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('ERROR: [fetchClient - Clients.register]', err);
          if (err.status === 400) {
            const error = await err.json();
            // eslint-disable-next-line no-console
            console.error('error', error);
          }
        }
        setErrors('Impossible d\'enregister un nouveau client');
        // console.log({ severity: 'error', message: 'Impossible de mettre à jour l\'image du profil.' });
        setLoading(false);
      });
  }, [setClient, setErrors, setLoading]);

  const handleDownload = useCallback(async () => {
    const url = new URL(client?.redirectUris);
    registerClient(`${url.origin}/api/register`);
  }, [client?.redirectUris, registerClient]);

  /**
   * Method to fetch from the db all the data of the current client
   */
  const fetchClient = useCallback(async () => {
    setLoading(true);
    setErrors('');
    await Clients.getById(serviceId)
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((clientData) => {
        setClient(clientData);
        // Todo success snackbar
        setLoading(false);
      })
      .catch(async (err) => {
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('ERROR: [fetchClient - Clients.getById]', err);
          if (err.status === 400) {
            const error = await err.json();
            // eslint-disable-next-line no-console
            console.error('error', error);
          }
        }
        setErrors('Impossible charger les données du client');
        // console.log({ severity: 'error', message: 'Impossible de mettre à jour l\'image du profil.' });
        setLoading(false);
      });
  }, [serviceId, setClient, setErrors, setLoading]);

  /**
   * At the mounted state load the current client data
   */
  useEffectOnce(() => {
    fetchClient();
  });

  return (
    <HeaderWrapper icon={IoIosConstruct} title="Création d'un service">
      <div className={styles.Root}>
        <TitleSection icon={IoIosSync} title="Mise à jour des données du service" variant="underlined" />
        {/* Box to informe the user */}
        <div className={styles.ButtonContainer}>
          <Button type="button" variant="contained" color="main" startIcon={IoIosDownload} onClick={handleDownload} title="Récupération automatique à partir du service source.">Récupération</Button>
        </div>
        <If condition={!errors}>
          <Then>
            <ServicesUpdateForm loading={loading} clientData={client} />
          </Then>
          <Else>
            <Alert severity="error">
              {errors}
            </Alert>
          </Else>
        </If>
      </div>
    </HeaderWrapper>
  );
}

export default React.memo(Update);
