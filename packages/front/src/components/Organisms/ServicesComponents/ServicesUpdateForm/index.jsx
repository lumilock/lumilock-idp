import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Clients } from '../../../../services/Api';
import {
  InputControlled, SelectControlled, CheckboxGroup, AvatarControlled,
} from '../../../Molecules';
import { FormCard } from '../../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import { useUpdate } from '../../../../services/Hooks';
// import styles from './ServicesUpdateForm.module.scss';

function ServicesUpdateForm({ loading, clientData }) {
  // React hook form
  const {
    handleSubmit, reset, control, setError,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: { ...defaultValues, ...clientData } });

  /**
   * Method used to reset all values
   */
  const handleReset = () => {
    reset({ ...defaultValues, ...clientData });
  };

  const onSubmit = async (data) => {
    console.log(data);
    return;
    // eslint-disable-next-line no-unreachable
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
      .then((updatedData) => {
        console.log('updatedData', updatedData);
        // setOpen({ key: updatedData?.secret, id: clientData?.id });
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

  /**
   * Each time the form is loading we reset the form data
   */
  useUpdate(() => {
    reset({ ...defaultValues, ...clientData });
  }, [loading]);

  return (
    <FormCard
      handleSubmit={handleSubmit(onSubmit)}
      handleReset={handleReset}
      submitTitle="Modifier"
      loading={loading}
    >
      <AvatarControlled
        control={control}
        name="file"
        type="file"
        variant="squircle"
        accept="image/png, image/jpeg, image/webp"
        initialPicture={clientData?.logoUri}
      />
      <InputControlled
        control={control}
        placeholder="Lumilock"
        type="text"
        name="clientName"
        label="Nom du service"
        size="small"
        loading={loading}
      />
      <InputControlled
        control={control}
        placeholder="https://192.168.99.1:3001/"
        type="url"
        name="appUrl"
        label="Url de l'application (frontend)"
        size="small"
        loading={loading}
      />
      <CheckboxGroup
        label="Cacher l'application"
        loading={loading}
        checkbox={[{
          control,
          name: 'hide',
          label: 'Caché',
          size: 'small',
        }]}
      />
      {/* TODO Array chips field */}
      <InputControlled
        control={control}
        placeholder="https://192.168.99.1:3000/api/auth/callback"
        type="url"
        name="redirectUris"
        label="Url de redirection (backend)"
        size="small"
        loading={loading}
      />
      {/* TODO Array chips field */}
      <InputControlled
        control={control}
        placeholder="users,clients"
        type="text"
        name="permissions"
        label="Permissions"
        size="small"
        loading={loading}
      />
      <SelectControlled
        control={control}
        placeholder="--Type de l'application--"
        type="text"
        options={['web', 'native']}
        name="applicationType"
        label="Type d'application"
        size="small"
        loading={loading}
      />
      <InputControlled
        control={control}
        placeholder="test"
        type="text"
        name="logoUri"
        label="Url du logo"
        size="small"
        loading={loading}
      />
    </FormCard>

  );
}

ServicesUpdateForm.propTypes = {
  clientData: PropTypes.shape({
    clientName: PropTypes.string,
    appUrl: PropTypes.string,
    hide: PropTypes.bool,
    redirectUris: PropTypes.arrayOf(PropTypes.string),
    permissions: PropTypes.arrayOf(PropTypes.string),
    applicationType: PropTypes.string,
    logoUri: PropTypes.string,
  }),
  loading: PropTypes.bool,
};

ServicesUpdateForm.defaultProps = {
  clientData: {},
  loading: true,
};

export default React.memo(ServicesUpdateForm);
