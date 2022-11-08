/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Auth, Users } from '../../../../services/Api';
import { requestCatch } from '../../../../services/JSXTools';
import { CheckboxGroup } from '../../../Molecules';
import { FormCard } from '../../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import { Typography } from '../../../Electrons';
// import styles from './ProfilePermissionsForm.module.scss';

function ProfilePermissionsForm({
  userId, defaultData, setDefaultData,
}) {
  // Memos
  const {
    id,
    clientName,
    permissions,
    isActive,
    isArchived,
    userName,
    usersClientsId,
    usersClientsRole,
    usersClientsAuthorization,
    usersClientsPermissions,
  } = useMemo(() => defaultData, [defaultData]);

  console.log('defaultData', defaultData);
  console.log('usersClientsPermissions', usersClientsPermissions);
  const initialValues = useMemo(() => ({
    clientId: id,
    role: usersClientsRole,
    permissions: usersClientsPermissions,
  }), [id, usersClientsPermissions, usersClientsRole]);

  // React hook form
  const {
    handleSubmit, reset, control, setError,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: { ...defaultValues, ...initialValues } });

  /**
   * Method used to reset all values
   */
  const handleReset = () => {
    reset({ ...defaultValues });
  };

  /**
   * Method used to send form's data to the db in order to
   * patch the user states
   */
  const onSubmit = async (data) => {
    console.log(data);
    // // user info to patch
    // const options = {
    //   isActive: !!data?.isActive,
    //   isArchived: !!data?.isArchived,
    // };

    // // user api functions
    // const apiFunction = hasDefaultData ? Users.updateStates(userId, options) : Auth.updateStates(options);

    // await apiFunction
    //   .then(async (res) => {
    //     if (res.status === 200) {
    //       return res.json();
    //     }
    //     return Promise.reject(res);
    //   })
    //   .then((userStateData) => {
    //     if (!hasDefaultData) {
    //     } else {
    //       setDefaultData((o) => ({ ...o, ...userStateData }));
    //     }
    //     handleReset(undefined, userStateData);
    //     // Todo success snackbar
    //   })
    //   .catch(async (err) => {
    //     const dbgMsg = `ERROR: [onSubmit - ${hasDefaultData ? 'Users' : 'Auth'}.updateStates]`;
    //     requestCatch(err, dbgMsg, setError);
    //   });
  };

  return (
    <FormCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
      <Typography variant="subtitle1">{clientName}</Typography>
      <CheckboxGroup
        label="Permissions"
        checkbox={permissions?.map((p) => ({
          control,
          name: 'permissions',
          label: p,
          value: p,
          size: 'small',
        }))}
      />
    </FormCard>
  );
}

ProfilePermissionsForm.propTypes = {
  userId: PropTypes.string,
  defaultData: PropTypes.shape({
    id: PropTypes.string,
    clientName: PropTypes.string,
    permissions: PropTypes.arrayOf(PropTypes.string),
    isActive: PropTypes.bool,
    isArchived: PropTypes.bool,
    userId: PropTypes.string,
    userName: PropTypes.string,
    usersClientsId: PropTypes.string,
    usersClientsRole: PropTypes.oneOf(['none', 'admin', 'user', 'guest']),
    usersClientsAuthorization: PropTypes.bool,
    usersClientsPermissions: PropTypes.arrayOf(PropTypes.string),
  }),
  setDefaultData: PropTypes.func,
};

ProfilePermissionsForm.defaultProps = {
  userId: undefined,
  defaultData: undefined,
  setDefaultData: undefined,
};

export default React.memo(ProfilePermissionsForm);
