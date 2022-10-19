/* eslint-disable no-unused-vars */
import React, { useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoIosArchive, IoIosCheckmark, IoIosClose, IoIosCreate, IoIosEye, IoIosEyeOff,
} from 'react-icons/io';

import UsersContext from '../../../pages/Users/UsersContext';
import { Users } from '../../../services/Api';
import { useEffectOnce, useRequestStates, useUpdate } from '../../../services/Hooks';
import {
  Else, Icon, If, Then, Typography,
} from '../../Atoms';
import { Button, LabeledText, UserProfile } from '../../Molecules';
import styles from './UserSideBarContent.module.scss';

function UserSideBarContent() {
  // Context
  const { selected } = useContext(UsersContext);
  // Router
  const navigate = useNavigate();
  // Request states
  const {
    data: user,
    errors,
    loading,
    setData: setUser,
    setErrors,
    setLoading,
  } = useRequestStates(null);

  const getFormattedDate = (date) => new Date(date).toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  const handleClick = (id) => {
    navigate(`${id}`);
  };

  const fetchUser = useCallback(
    async () => {
      setErrors('');
      setLoading(true);
      await Users.getById(selected)
        .then(async (response) => {
          if ([200].includes(response?.status)) {
            return response?.json();
          }
          throw new Error(response?.statusText);
        }).then((response) => {
          setUser(response || null);
          setLoading(false);
        }).catch((err) => {
          if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('ERROR: [fetchUser - Users.getById]', err);
          }
          setUser(null);
          setErrors('Impossible de charger cet utilisateur.');
          setLoading(false);
        });
    },
    [selected, setErrors, setLoading, setUser],
  );

  // On updated
  useUpdate(() => {
    if (selected) {
      fetchUser(selected);
    }
  }, [selected]);

  // On Mounted
  useEffectOnce(() => {
    if (selected) {
      fetchUser(selected);
    }
  });

  return (
    <div className={styles.Root}>
      <If condition={!errors}>
        <Then>
          <UserProfile
            loading={loading}
            picture={user?.picture}
            name={user?.name}
            gender={user?.gender}
            login={user?.login}
            locality={user?.login}
            loginColor="content3"
            localityColor="content3"
          />
          <Button startIcon={IoIosCreate} color="black" onClick={() => handleClick(user?.id)}>Éditer</Button>
          <pre>
            {JSON.stringify(user, 2, 2)}
          </pre>
        </Then>
        <Else>
          <Typography color="alert">{errors}</Typography>
        </Else>
      </If>
    </div>
  );
}

export default React.memo(UserSideBarContent);
