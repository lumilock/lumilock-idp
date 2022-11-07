import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoIosClock } from 'react-icons/io';

import { Auth, Users } from '../../../../services/Api';
import { updateUserPropsAction } from '../../../../store/auth/authAction';
import { authInfoSelector } from '../../../../store/auth/authSelector';
import locales from '../../../../assets/data/locales.json';
import timezones from '../../../../assets/data/timezones.json';
import { SelectControlled } from '../../../Molecules';
import { FormCard, TitleSection } from '../../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfileTimezoneForm.module.scss';
import { requestCatch } from '../../../../services/JSXTools';
import { useUpdate } from '../../../../services/Hooks';

function ProfileTimezoneForm({
  userId, defaultData, setDefaultData, loading,
}) {
  // Store
  const storeData = useSelector(authInfoSelector);
  const dispatch = useDispatch();
  // Memos
  const hasDefaultData = useMemo(() => (!!userId && !!defaultData && Object?.keys(defaultData)?.length > 0), [userId, defaultData]);
  const {
    zoneinfo,
    locale,
  } = useMemo(() => (hasDefaultData ? defaultData : storeData), [hasDefaultData, defaultData, storeData]);

  // React hook form
  const {
    handleSubmit, reset, control, setError,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: { ...defaultValues, ...{ zoneinfo, locale } } });

  /**
   * Method used to reset all values
   */
  const handleReset = (_, values = undefined) => {
    reset({
      ...defaultValues,
      ...(!values || Object.keys(values)?.length <= 0
        ? { zoneinfo, locale } : {
          zoneinfo: values?.zoneinfo,
          locale: values?.locale,
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
      zoneinfo: data?.zoneinfo || null,
      locale: data?.locale || null,
    };

    // user api functions
    const apiFunction = hasDefaultData ? Users.updateGeoData(userId, options) : Auth.updateGeoData(options);

    await apiFunction
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((userGeoData) => {
        if (!hasDefaultData) {
          dispatch(updateUserPropsAction(userGeoData));
        } else {
          setDefaultData((o) => ({ ...o, ...userGeoData }));
        }
        handleReset(undefined, userGeoData);
        // Todo success snackbar
      })
      .catch(async (err) => {
        const dbgMsg = `ERROR: [onSubmit - ${hasDefaultData ? 'Users' : 'Auth'}.updateTimezone]`;
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
      <TitleSection icon={IoIosClock} title="Informations géographique" variant="underlined" />
      <FormCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <SelectControlled
          control={control}
          placeholder="--Selectionner un fuseau horaire--"
          type="text"
          name="zoneinfo"
          options={timezones}
          label="Fuseau horaire"
          loading={loading}
          size="small"
        />
        <SelectControlled
          control={control}
          placeholder="--Selectionner une langue--"
          type="text"
          options={locales}
          name="locale"
          label="Langage"
          loading={loading}
          size="small"
        />
      </FormCard>
    </div>
  );
}

ProfileTimezoneForm.propTypes = {
  userId: PropTypes.string,
  defaultData: PropTypes.shape({
    zoneinfo: PropTypes.string,
    locale: PropTypes.string,
  }),
  loading: PropTypes.bool,
  setDefaultData: PropTypes.func,
};

ProfileTimezoneForm.defaultProps = {
  userId: undefined,
  defaultData: undefined,
  loading: false,
  setDefaultData: undefined,
};

export default React.memo(ProfileTimezoneForm);
