import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Users } from '../../../../services/Api';
import { requestCatch } from '../../../../services/JSXTools';
import { Typography } from '../../../Electrons';
import { Squircle } from '../../../Atoms';
import { CheckboxGroup, SelectControlled } from '../../../Molecules';
import { FormCard } from '../../../Cells';
import validationSchema from './validationSchema';
import defaultValues from './defaultValues';
import styles from './ProfilePermissionsForm.module.scss';

function ProfilePermissionsForm({
  userId, defaultData, setDefaultData,
}) {
  // Memos
  const {
    id,
    clientName,
    permissions,
    logoUri,
    usersClientsRole,
    usersClientsPermissions,
  } = useMemo(() => defaultData, [defaultData]);

  const initialValues = useMemo(() => ({
    clientId: id,
    role: usersClientsRole,
    ...(permissions?.reduce((accu, p) => ({ ...accu, [p]: usersClientsPermissions?.includes(p) }), {}) || {}),
    permissions: usersClientsPermissions,
  }), [id, permissions, usersClientsPermissions, usersClientsRole]);

  const roles = useMemo(() => ([{
    label: 'Aucun',
    value: 'none',
  },
  {
    label: 'Administrateur',
    value: 'admin',
  },
  {
    label: 'Utilisateur',
    value: 'user',
  },
  {
    label: 'Invité',
    value: 'guest',
  }]), []);

  // React hook form
  const {
    handleSubmit, reset, control, setError, setValue, watch,
  } = useForm({ resolver: yupResolver(validationSchema), defaultValues: { ...defaultValues, ...initialValues } });
  const watchPermissions = watch('permissions');

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
    // user update
    const options = {
      clientId: data?.clientId || null,
      role: data?.role || null,
      permissions: data?.permissions || null,
    };

    await Users.updatePermissions(userId, options)
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then((userStateData) => {
        setDefaultData((o) => ({ ...o, ...userStateData }));
        handleReset(undefined, userStateData);
        // Todo success snackbar
      })
      .catch(async (err) => {
        const dbgMsg = 'ERROR: [onSubmit - Users.updatePermissions]';
        requestCatch(err, dbgMsg, setError);
      });
  };

  const handleChange = useCallback(
    (e, key) => {
      if (e?.target?.checked) {
        if (!watchPermissions?.includes(key)) {
          setValue('permissions', [...watchPermissions, key], { shouldValidate: true });
        }
      } else {
        setValue('permissions', watchPermissions?.filter((p) => p !== key), { shouldValidate: true });
      }
    },
    [setValue, watchPermissions],
  );

  return (
    <FormCard handleSubmit={handleSubmit(onSubmit)} handleReset={handleReset}>
      <div className={styles.Title}>
        <Squircle image={logoUri} size="regular" />
        <Typography variant="subtitle1">{clientName}</Typography>
        <Typography variant="body2" color="content3">{id}</Typography>
      </div>
      <SelectControlled
        control={control}
        placeholder="--Selectionner un role--"
        name="role"
        options={roles}
        label="Role"
        size="small"
      />
      <CheckboxGroup
        label="Permissions"
        checkbox={permissions?.map((p) => ({
          control,
          name: p,
          label: p,
          size: 'small',
          callback: (e) => handleChange(e, p),
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
    logoUri: PropTypes.bool,
    usersClientsRole: PropTypes.oneOf(['none', 'admin', 'user', 'guest']),
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
