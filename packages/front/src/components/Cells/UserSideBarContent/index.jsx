import React, { useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  IoIosArchive, IoIosCheckmark, IoIosClose, IoIosCreate, IoIosGlobe, IoIosPerson,
} from 'react-icons/io';

import { Users } from '../../../services/Api';
import { useEffectOnce, useRequestStates, useUpdate } from '../../../services/Hooks';
import {
  Else, Icon, If, Then, Typography,
} from '../../Electrons';
import { Button } from '../../Atoms';
import {
  LabeledText, LinkButton, UserProfile,
} from '../../Molecules';
import UsersContext from '../../../pages/Users/UsersContext';
import flags from '../../../assets/data/flags-24x24.json';
import styles from './UserSideBarContent.module.scss';
import { authIdSelector } from '../../../store/auth/authSelector';

function UserSideBarContent() {
  // Context
  const { selected } = useContext(UsersContext);
  // Router
  const navigate = useNavigate();
  // Store
  const authId = useSelector(authIdSelector);
  // Request states
  const {
    data: user,
    errors,
    loading,
    setData: setUser,
    setErrors,
    setLoading,
  } = useRequestStates(null);

  /**
   * Methode to format a js Date
   * @param {Date} date : date we want to formatte
   * @returns formatted date
   */
  const getFormattedDate = (date, hours = true) => new Date(date).toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(hours ? {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    } : {}),
  });

  const handleClick = (id) => {
    if (authId !== id) {
      navigate(`${id}`);
    } else {
      navigate('/profile');
    }
  };

  /**
   * Method to retreave user's infos from db
   */
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
          {/* Profile */}
          <UserProfile
            loading={loading}
            picture={user?.picture}
            name={user?.name}
            gender={user?.gender}
            login={user?.login}
            locality={user?.address?.locality || '-/-'}
            loginColor="content3"
            localityColor="content3"
          />

          {/* Button */}
          <Button startIcon={IoIosCreate} color="content1" onClick={() => handleClick(user?.id)}>Éditer</Button>

          {/* Icons Actions and States */}
          <div className={styles.Icons}>
            <div className={styles.Actions}>
              <LinkButton
                href={user?.profile}
                target="_blank"
                rel="noopener noreferrer"
                loading={loading}
                disabled={!user?.profile}
                iconProps={{
                  size: 'small',
                  ionIcon: IoIosPerson,
                  title: user?.profile ? user?.profile : 'Aucun profil renseigné',
                }}
              />
              <LinkButton
                href={user?.website}
                target="_blank"
                rel="noopener noreferrer"
                loading={loading}
                disabled={!user?.website}
                iconProps={{
                  size: 'small',
                  ionIcon: IoIosGlobe,
                  title: user?.website ? user?.website : 'Aucun site renseigner',
                }}
              />
            </div>
            <div className={styles.States}>
              <Icon
                loading={loading}
                size="small"
                ionIcon={user?.isActive ? IoIosCheckmark : IoIosClose}
                color={user?.isActive ? 'main' : 'alert dark'}
                title={user?.isActive ? 'Actif' : 'Inactif'}
              />
              <Icon
                loading={loading}
                size="small"
                ionIcon={IoIosArchive}
                color={user?.isArchive ? 'alert dark' : 'main'}
                title={user?.isArchive ? 'Archivé' : 'Non archivé'}
              />
              <Icon
                loading={loading}
                component="img"
                size="small"
                title={user?.locale?.split('-')?.[1]?.toLowerCase() || user?.locale?.split('-')?.[0]?.toLowerCase() || 'Aucune langue trouvé'}
                src={flags?.[user?.locale?.split('-')?.[1]?.toLowerCase() || user?.locale?.split('-')?.[0]?.toLowerCase()]}
                alt=""
              />
            </div>
          </div>

          {/* Fields */}
          <div className={styles.Fields}>
            <LabeledText loading={loading} label="Surnom" text={user?.nickname || '-/-'} />
            <LabeledText loading={loading} label="Nom d'utilisateur préféré" text={user?.preferredUsername || '-/-'} />
            <LabeledText loading={loading} label="Date de naissance" text={getFormattedDate(user?.birthdate, false)} />
            <LabeledText loading={loading} label="Mail" text={user?.email || '-/-'} />
            <LabeledText loading={loading} label="Téléphone portable" text={user?.Mobile || '-/-'} />
            <LabeledText loading={loading} label="Date d'installation" text={getFormattedDate(user?.createDateTime)} />
            <LabeledText loading={loading} label="Date de dernière mise à jour" text={getFormattedDate(user?.lastChangedDateTime)} />
          </div>
        </Then>
        <Else>
          <Typography color="alert">{errors}</Typography>
        </Else>
      </If>
    </div>
  );
}

export default React.memo(UserSideBarContent);
