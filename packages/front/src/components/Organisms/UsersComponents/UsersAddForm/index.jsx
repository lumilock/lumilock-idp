import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoIosAdd } from 'react-icons/io';

import { InputControlled, RadiosGroup } from '../../../Molecules';
import { FormCard } from '../../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';

function UsersAddForm() {
  // React hook form
  const {
    handleSubmit, reset, control,
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
        placeholder="Léo Martin"
        type="text"
        name="middleName"
        label="Deuxième nom (optionel)"
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
        label="Date de naissance"
        size="small"
      />
    </FormCard>
  );
}

export default UsersAddForm;
