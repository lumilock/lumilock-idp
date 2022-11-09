import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IoIosSwitch } from 'react-icons/io';

import { updateUserPropsAction } from '../../../../store/auth/authAction';
import { authInfoSelector } from '../../../../store/auth/authSelector';
import { Auth, Users } from '../../../../services/Api';
import { useUpdate } from '../../../../services/Hooks';
import { requestCatch } from '../../../../services/JSXTools';
import { CheckboxGroup } from '../../../Molecules';
import { FormCard, TitleSection } from '../../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfileStateForm.module.scss';

function ProfileStateForm({
  userId, defaultData, setDefaultData, loading,
}) {
  // Store
  const storeData = useSelector(authInfoSelector);
  const dispatch = useDispatch();
  // Memos
  const hasDefaultData = useMemo(() => (!!userId && !!defaultData && Object?.keys(defaultData)?.length > 0), [userId, defaultData]);
  const {
    isActive,
    isArchived,
  } = useMemo(() => (hasDefaultData ? defaultData : storeData), [hasDefaultData, defaultData, storeData]);

  // React hook form
  const {
    handleSubmit, reset, control, setError,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: { ...defaultValues, ...{ isActive, isArchived } } });

  /**
   * Method used to reset all values
   */
  const handleReset = (_, values = undefined) => {
    reset({
      ...defaultValues,
      ...(!values || Object.keys(values)?.length <= 0
        ? { isActive, isArchived } : {
          isActive: values?.isActive,
          isArchived: values?.isArchived,
        }),
    });
  };

  /**
   * Method used to send form's data to the db in order to
   * patch the user states
   */
  const onSubmit = async (data) => {
    // user info to patch
    const options = {
      isActive: !!data?.isActive,
      isArchived: !!data?.isArchived,
    };

    // user api functions
    const apiFunction = hasDefaultData ? Users.updateStates(userId, options) : Auth.updateStates(options);

    await apiFunction
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((userStateData) => {
        if (!hasDefaultData) {
          dispatch(updateUserPropsAction(userStateData));
        } else {
          setDefaultData((o) => ({ ...o, ...userStateData }));
        }
        handleReset(undefined, userStateData);
        // Todo success snackbar
      })
      .catch(async (err) => {
        const dbgMsg = `ERROR: [onSubmit - ${hasDefaultData ? 'Users' : 'Auth'}.updateStates]`;
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
      <TitleSection icon={IoIosSwitch} title="États de l'utilisateur" variant="underlined" />
      <FormCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
        <CheckboxGroup
          label="États"
          loading={loading}
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
    </div>
  );
}

ProfileStateForm.propTypes = {
  userId: PropTypes.string,
  defaultData: PropTypes.shape({
    isActive: PropTypes.bool,
    isArchived: PropTypes.bool,
  }),
  loading: PropTypes.bool,
  setDefaultData: PropTypes.func,
};

ProfileStateForm.defaultProps = {
  userId: undefined,
  defaultData: undefined,
  loading: false,
  setDefaultData: undefined,
};

export default React.memo(ProfileStateForm);
