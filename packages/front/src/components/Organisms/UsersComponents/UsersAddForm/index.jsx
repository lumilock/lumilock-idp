import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoIosAdd } from 'react-icons/io';

import { Users } from '../../../../services/Api';
import locales from '../../../../assets/data/locales.json';
import timezones from '../../../../assets/data/timezones.json';
import {
  CheckboxGroup, InputControlled, RadiosGroup, SelectControlled,
} from '../../../Molecules';
import { FormCard } from '../../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';

function UsersAddForm() {
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

  /**
   * Method to submit the form
   */
  const onSubmit = async (data) => {
    console.log('data', data);
    await Users.create({
      password: data?.password || null,
      givenName: data?.givenName || null,
      familyName: data?.familyName || null,
      middleName: data?.middleName || null,
      nickname: data?.nickname || null,
      preferredUsername: data?.preferredUsername || null,
      profile: data?.profile || null,
      website: data?.website || null,
      email: data?.email || null,
      gender: data?.gender || null,
      birthdate: data?.birthdate || null,
      zoneinfo: data?.zoneinfo || null,
      locale: data?.locale || null,
      phoneNumber: data?.phoneNumber || null,
      isActive: !!data?.isActive,
      isArchived: !!data?.isArchived,
    })
      .then(async (res) => {
        if (res.status === 201) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((userData) => {
        console.log('userData', userData);
        // handleReset();
        // Todo success snackbar
      })
      .catch(async (err) => {
        if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('ERROR: [onSubmit - Users.create]', err);
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
      });
  };

  return (
    <FormCard
      handleSubmit={handleSubmit(onSubmit)}
      handleReset={handleReset}
      submitTitle="Créer"
      submitIcon={IoIosAdd}
    >
      <InputControlled
        control={control}
        placeholder="Gabriel"
        type="text"
        name="givenName"
        label="Prenom"
        size="small"
      />
      <InputControlled
        control={control}
        placeholder="Dupond"
        type="text"
        name="familyName"
        label="Nom de famille"
        size="small"
      />
      <InputControlled
        control={control}
        placeholder="Léo Martin"
        type="text"
        name="middleName"
        label="Deuxième nom (optionel)"
        size="small"
      />
      <InputControlled
        control={control}
        placeholder="Gabi Dupond"
        type="text"
        name="preferredUsername"
        label="Nom d'utilisateur (optionnel)"
        size="small"
      />
      <InputControlled
        control={control}
        placeholder="Gabi"
        type="text"
        name="nickname"
        label="Surnom (optionel)"
        size="small"
      />
      <RadiosGroup
        label="Sexe"
        radios={[{
          control,
          name: 'gender',
          label: 'Homme',
          value: 'male',
          size: 'small',
        },
        {
          control,
          name: 'gender',
          label: 'Femme',
          value: 'female',
          size: 'small',
          hideError: true,
        },
        {
          control,
          name: 'gender',
          label: 'Autre',
          value: 'other',
          size: 'small',
          hideError: true,
        }]}
      />
      <InputControlled
        control={control}
        placeholder="15/10/1969"
        type="date"
        name="birthdate"
        label="Date de naissance (optionel)"
        size="small"
      />
      <InputControlled
        control={control}
        placeholder="gabriel.dupond@lumilock.com"
        type="email"
        name="email"
        label="Email (optionel)"
        size="small"
      />
      <InputControlled
        control={control}
        placeholder="+33615636948"
        type="tel"
        name="phoneNumber"
        label="Téléphone portable (optionel)"
        size="small"
      />
      <InputControlled
        control={control}
        placeholder="●●●●●●"
        type="password"
        name="password"
        label="Mot de passe"
        size="small"
      />
      <InputControlled
        control={control}
        placeholder="https://leo-martin.com/profile"
        type="url"
        name="profile"
        label="Profil (optionel)"
        size="small"
      />
      <InputControlled
        control={control}
        placeholder="https://leo-martin.com"
        type="url"
        name="website"
        label="Site web (optionel)"
        size="small"
      />
      <SelectControlled
        control={control}
        placeholder="--Selectionner un fuseau horaire--"
        type="text"
        name="zoneinfo"
        options={timezones}
        label="Fuseau horaire"
        size="small"
      />
      <SelectControlled
        control={control}
        placeholder="--Selectionner une langue--"
        type="text"
        options={locales}
        name="locale"
        label="Langage"
        size="small"
      />
      <CheckboxGroup
        label="État de l'utilisateur"
        checkbox={[{
          control,
          name: 'isActive',
          label: 'Actif',
          size: 'small',
        },
        {
          control,
          name: 'isArchived',
          label: 'Archivé',
          size: 'small',
        }]}
      />
    </FormCard>
  );
}

export default UsersAddForm;
