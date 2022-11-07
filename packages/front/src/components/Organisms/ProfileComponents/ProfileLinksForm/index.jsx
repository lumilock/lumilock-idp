import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoIosGlobe } from 'react-icons/io';

import { updateUserPropsAction } from '../../../../store/auth/authAction';
import { authInfoSelector } from '../../../../store/auth/authSelector';
import { Auth, Users } from '../../../../services/Api';
import { requestCatch } from '../../../../services/JSXTools';
import { useUpdate } from '../../../../services/Hooks';
import { InputControlled } from '../../../Molecules';
import { FormCard, TitleSection } from '../../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfileLinksForm.module.scss';

function ProfileLinksForm({
  userId, defaultData, setDefaultData, loading,
}) {
  // Store
  const storeData = useSelector(authInfoSelector);
  const dispatch = useDispatch();
  // Memos
  const hasDefaultData = useMemo(() => (!!userId && !!defaultData && Object?.keys(defaultData)?.length > 0), [userId, defaultData]);
  const {
    profile,
    website,
  } = useMemo(() => (hasDefaultData ? defaultData : storeData), [hasDefaultData, defaultData, storeData]);

  // React hook form
  const {
    handleSubmit, reset, control, setError,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: { ...defaultValues, ...{ profile, website } } });

  /**
   * Method used to reset all values
   */
  const handleReset = (_, values = undefined) => {
    reset({
      ...defaultValues,
      ...(!values || Object.keys(values)?.length <= 0
        ? { profile, website } : {
          profile: values?.profile,
          website: values?.website,
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
      profile: data?.profile || null,
      website: data?.website || null,
    };

    // user api functions
    const apiFunction = hasDefaultData ? Users.updateLinks(userId, options) : Auth.updateLinks(options);

    await apiFunction
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((userLinks) => {
        if (!hasDefaultData) {
          dispatch(updateUserPropsAction(userLinks));
        } else {
          setDefaultData((o) => ({ ...o, ...userLinks }));
        }
        handleReset(undefined, userLinks);
        // Todo success snackbar
      })
      .catch(async (err) => {
        const dbgMsg = `ERROR: [onSubmit - ${hasDefaultData ? 'Users' : 'Auth'}.updateLinks]`;
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
      <TitleSection icon={IoIosGlobe} title="Données externes" variant="underlined" />
      <FormCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <InputControlled
          control={control}
          placeholder="https://leo-martin.com/profile"
          type="url"
          name="profile"
          label="Profil"
          loading={loading}
          size="small"
        />
        <InputControlled
          control={control}
          placeholder="https://leo-martin.com"
          type="url"
          name="website"
          label="Site web"
          loading={loading}
          size="small"
        />
      </FormCard>
    </div>
  );
}

ProfileLinksForm.propTypes = {
  userId: PropTypes.string,
  defaultData: PropTypes.shape({
    profile: PropTypes.string,
    website: PropTypes.string,
  }),
  loading: PropTypes.bool,
  setDefaultData: PropTypes.func,
};

ProfileLinksForm.defaultProps = {
  userId: undefined,
  defaultData: undefined,
  loading: false,
  setDefaultData: undefined,
};

export default React.memo(ProfileLinksForm);
