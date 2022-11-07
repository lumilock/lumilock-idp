import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosPerson } from 'react-icons/io';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { authInfoSelector } from '../../../../store/auth/authSelector';
import { updateUserPropsAction } from '../../../../store/auth/authAction';
import { useUpdate } from '../../../../services/Hooks';
import { Auth, Users } from '../../../../services/Api';
import { InputControlled } from '../../../Molecules';
import { FormCard, TitleSection } from '../../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfileIdentityForm.module.scss';
import { requestCatch } from '../../../../services/JSXTools';

function ProfileIdentityForm({
  userId, defaultData, setDefaultData, loading,
}) {
  // Store
  const storeData = useSelector(authInfoSelector);
  const dispatch = useDispatch();
  // Memos
  const hasDefaultData = useMemo(() => (!!userId && !!defaultData && Object?.keys(defaultData)?.length > 0), [userId, defaultData]);
  const {
    login,
    email,
    phoneNumber,
  } = useMemo(() => (hasDefaultData ? defaultData : storeData), [hasDefaultData, defaultData, storeData]);
  // React hook form
  const {
    handleSubmit, reset, control, setError,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: { ...defaultValues, ...{ login, email, phoneNumber } } });

  /**
   * Method used to reset all values
   */
  const handleReset = (_, values = undefined) => {
    reset({
      ...defaultValues,
      ...(!values || Object.keys(values)?.length <= 0
        ? { login, email, phoneNumber } : {
          login: values?.login,
          email: values?.email,
          phoneNumber: values?.phoneNumber,
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
      email: data?.email || null,
      phoneNumber: data?.phoneNumber || null,
    };

    // user api functions
    const apiFunction = hasDefaultData ? Users.updateIdentity(userId, options) : Auth.updateIdentity(options);

    await apiFunction
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((userIdentity) => {
        if (!hasDefaultData) {
          dispatch(updateUserPropsAction(userIdentity));
        } else {
          setDefaultData((o) => ({ ...o, ...userIdentity, login }));
        }
        handleReset(undefined, { ...userIdentity, login });
      })
      .catch(async (err) => {
        const dbgMsg = `ERROR: [onSubmit - ${hasDefaultData ? 'Users' : 'Auth'}.updateIdentity]`;
        requestCatch(err, dbgMsg, setError);
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
      <TitleSection icon={IoIosPerson} title="Identité" variant="underlined" />
      <FormCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <InputControlled
          control={control}
          placeholder="gabriel.dupond"
          type="text"
          name="login"
          label="Login"
          size="small"
          loading={loading}
          disabled
        />
        <InputControlled
          control={control}
          placeholder="gabriel.dupond@lumilock.com"
          type="email"
          name="email"
          label="Email (optionel)"
          loading={loading}
          size="small"
        />
        <InputControlled
          control={control}
          placeholder="+33615636948"
          type="tel"
          name="phoneNumber"
          label="Téléphone portable (optionel)"
          loading={loading}
          size="small"
        />
      </FormCard>
    </div>
  );
}

ProfileIdentityForm.propTypes = {
  userId: PropTypes.string,
  defaultData: PropTypes.shape({
    login: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
  }),
  setDefaultData: PropTypes.func,
  loading: PropTypes.bool,
};

ProfileIdentityForm.defaultProps = {
  userId: undefined,
  defaultData: undefined,
  setDefaultData: undefined,
  loading: false,
};

export default React.memo(ProfileIdentityForm);
