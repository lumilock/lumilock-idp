import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoIosInformationCircle } from 'react-icons/io';

import { updateUserPropsAction } from '../../../../store/auth/authAction';
import { authInfoSelector } from '../../../../store/auth/authSelector';
import { requestCatch } from '../../../../services/JSXTools';
import { Auth, Users } from '../../../../services/Api';
import { toStringDate } from '../../../../services/Tools';
import { InputControlled, RadiosGroup } from '../../../Molecules';
import { FormCard, TitleSection } from '../../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfileInfosForm.module.scss';
import { useUpdate } from '../../../../services/Hooks';

function ProfileInfosForm({
  userId, defaultData, setDefaultData, loading,
}) {
  // Store
  const storeData = useSelector(authInfoSelector);
  const dispatch = useDispatch();
  // Memos
  const hasDefaultData = useMemo(() => (!!userId && !!defaultData && Object?.keys(defaultData)?.length > 0), [userId, defaultData]);
  const {
    familyName,
    gender,
    birthdate,
    givenName,
    middleName,
    name,
    nickname,
    preferredUsername,
  } = useMemo(() => (hasDefaultData ? defaultData : storeData), [hasDefaultData, defaultData, storeData]);

  // React hook form
  const {
    handleSubmit, reset, control, setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...defaultValues,
      ...{
        familyName, gender, birthdate: toStringDate(birthdate), givenName, middleName, name, nickname, preferredUsername,
      },
    },
  });

  /**
   * Method used to reset all values
   */
  const handleReset = (_, values = undefined) => {
    reset({
      ...defaultValues,
      ...(!values || Object.keys(values)?.length <= 0
        ? {
          familyName, gender, birthdate: toStringDate(birthdate), givenName, middleName, name, nickname, preferredUsername,
        } : {
          familyName: values?.familyName,
          gender: values?.gender,
          birthdate: toStringDate(values?.birthdate),
          givenName: values?.givenName,
          middleName: values?.middleName,
          name: values?.name,
          nickname: values?.nickname,
          preferredUsername: values?.preferredUsername,
        }),
    });
  };

  /**
   * Method used to send form's data to the db in order to
   * path the user profile picture
   */
  const onSubmit = async (data) => {
    // user info to patch
    const options = {
      familyName: data?.familyName || null,
      gender: data?.gender || null,
      birthdate: data?.birthdate?.toISOString() || null,
      givenName: data?.givenName || null,
      middleName: data?.middleName || null,
      nickname: data?.nickname || null,
      preferredUsername: data?.preferredUsername || null,
    };

    // user api functions
    const apiFunction = hasDefaultData ? Users.updatePersonnalInfo(userId, options) : Auth.updatePersonnalInfo(options);

    await apiFunction
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((userInfo) => {
        if (!hasDefaultData) {
          dispatch(updateUserPropsAction(userInfo));
        } else {
          setDefaultData((o) => ({ ...o, ...userInfo }));
        }
        handleReset(undefined, userInfo);
        // Todo success snackbar
      })
      .catch(async (err) => {
        const debuMsg = `ERROR: [onSubmit - ${hasDefaultData ? 'Users' : 'Auth'}.updatePersonnalInfo]`;
        requestCatch(err, debuMsg, setError);
      });
  };

  /**
   * Each time the form is loading we reset the form data
   */
  useUpdate(() => {
    handleReset();
  }, [loading]);

  return (
    <div className={styles.Root}>
      <TitleSection icon={IoIosInformationCircle} title="Informations personnelles" variant="underlined" />
      <FormCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <InputControlled
          control={control}
          placeholder="Gabriel Léo Martin Dupond"
          type="text"
          name="name"
          label="Nom complet"
          size="small"
          loading={loading}
          disabled
        />
        <InputControlled
          control={control}
          placeholder="Gabriel"
          type="text"
          name="givenName"
          label="Prenom"
          loading={loading}
          size="small"
        />
        <InputControlled
          control={control}
          placeholder="Léo Martin"
          type="text"
          name="middleName"
          label="Deuxième nom (optionel)"
          loading={loading}
          size="small"
        />
        <InputControlled
          control={control}
          placeholder="Dupond"
          type="text"
          name="familyName"
          label="Nom de famille"
          loading={loading}
          size="small"
        />
        <InputControlled
          control={control}
          placeholder="Gabi Dupond"
          type="text"
          name="preferredUsername"
          label="Nom d'utilisateur (optionnel)"
          loading={loading}
          size="small"
        />
        <InputControlled
          control={control}
          placeholder="Gabi"
          type="text"
          name="nickname"
          label="Surnom (optionel)"
          loading={loading}
          size="small"
        />
        <RadiosGroup
          label="Sexe"
          loading={loading}
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
          loading={loading}
          size="small"
        />
      </FormCard>
    </div>
  );
}

ProfileInfosForm.propTypes = {
  userId: PropTypes.string,
  defaultData: PropTypes.shape({
    familyName: PropTypes.string,
    gender: PropTypes.oneOf(['male', 'female', 'other']),
    birthdate: PropTypes.string,
    givenName: PropTypes.string,
    middleName: PropTypes.string,
    name: PropTypes.string,
    nickname: PropTypes.string,
    preferredUsername: PropTypes.string,
  }),
  loading: PropTypes.bool,
  setDefaultData: PropTypes.func,
};

ProfileInfosForm.defaultProps = {
  userId: undefined,
  defaultData: undefined,
  loading: false,
  setDefaultData: undefined,
};

export default React.memo(ProfileInfosForm);
