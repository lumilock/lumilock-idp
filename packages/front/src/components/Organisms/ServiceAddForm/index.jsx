import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoIosAdd, IoIosMedal } from 'react-icons/io';

import { Clients } from '../../../services/Api';
import {
  InputControlled, SelectControlled,
} from '../../Molecules';
import { FormCard, InfoBox } from '../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ServiceAddForm.module.scss';
import { Typography } from '../../Electrons';
import CheckboxControlled from '../../Molecules/FormFields/CheckboxField/CheckboxControlled';

function ServiceAddForm() {
  const [open, setOpen] = useState(null);
  // React hook form
  const {
    handleSubmit, reset, control, setError,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: { ...defaultValues } });

  /**
   * Method used to reset all values
   */
  const handleReset = () => {
    reset({ ...defaultValues });
  };
  const onSubmit = async (data) => {
    await Clients.create({
      clientName: data?.clientName || null,
      redirectUris: data?.redirectUris || null,
      applicationType: data?.applicationType || null,
      hide: !!data?.hide,
    })
      .then(async (res) => {
        if (res.status === 201) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((clientData) => {
        setOpen({ key: clientData?.secret, id: clientData?.id });
        handleReset();
        // Todo success snackbar
      })
      .catch(async (err) => {
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('ERROR: [onSubmit - Clients.create]', err);
        }
        if (err.status === 400) {
          const error = await err.json();

          if (typeof error?.message === 'object' && Object.keys(error?.message)?.length > 0) {
            Object.keys(error?.message).forEach((key) => {
              setError(key, { type: 'custom', message: error?.message?.[key] });
            });
          } else {
            // Todo snackbar error
            // setErrors(error?.message);
          }
        }
        // console.log({ severity: 'error', message: 'Impossible de mettre à jour l\'image du profil.' });
      });
  };
  return (
    <>
      {/* Box to informe the user */}
      <InfoBox
        title="Félicitation"
        icon={IoIosMedal}
        className={styles.Info}
        open={!!open}
        onClick={() => setOpen(null)}
      >
        <div className={styles.InfoContent}>
          <Typography variant="subtitle1">
            {`
            Vous venez d'ajouter un nouveau service à votre plateform
            ${process.env.REACT_APP_NAME || 'Lumilock'}.
            `}
          </Typography>
          <Typography variant="subtitle2">
            Assurez vous de renseigner l&apos;id et le secret suivant dans les variables d&apos;environnement de ce nouveau service avant de la lancer
          </Typography>
          <div>
            <Typography variant="body1">{`🆔 : ${open?.id}`}</Typography>
            <Typography variant="body1">{`🔑 : ${open?.key}`}</Typography>
            <Typography variant="h4">
              <i>
                Remarque: Le secret ne sera plus jamais accessible
              </i>
            </Typography>
          </div>
        </div>
      </InfoBox>
      {/* Form */}
      <FormCard
        handleSubmit={handleSubmit(onSubmit)}
        handleReset={handleReset}
        submitTitle="Créer"
        submitIcon={IoIosAdd}
      >
        <InputControlled
          control={control}
          placeholder="Lumilock"
          type="text"
          name="clientName"
          label="Nom du service"
          size="small"
        />
        <InputControlled
          control={control}
          placeholder="https://192.168.99.1:3000/api/auth/callback"
          type="url"
          name="redirectUris"
          label="Url de redirection (backend)"
          size="small"
        />
        <SelectControlled
          control={control}
          placeholder="--Type de l'application--"
          type="text"
          options={['web', 'native']}
          name="applicationType"
          label="Type d'application"
          size="small"
        />
        <>
          <Typography component="p" variant="subtitle2" color="content3">Cacher l&apos;application</Typography>
          <CheckboxControlled
            control={control}
            name="hide"
            label="Caché"
            size="small"
          />
        </>
      </FormCard>
    </>
  );
}

export default React.memo(ServiceAddForm);
