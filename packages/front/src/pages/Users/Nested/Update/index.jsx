import React, { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { IoIosPerson } from 'react-icons/io';

import { Users } from '../../../../services/Api';
import { requestCatch } from '../../../../services/JSXTools';
import { useEffectOnce, useRequestStates } from '../../../../services/Hooks';
import { ProfileInfosForm } from '../../../../components/Organisms';
import { HeaderWrapper } from '../../../../components/Species';
import styles from './Update.module.scss';

function Update() {
  // Router
  const { userId } = useParams();
  // Request states
  const {
    data: user,
    errors,
    loading,
    setData: setUser,
    setErrors,
    setLoading,
  } = useRequestStates(undefined, '', '', true);

  const infoData = useMemo(() => (user ? {
    name: user?.name,
    familyName: user?.familyName,
    gender: user?.gender,
    birthdate: user?.birthdate,
    givenName: user?.givenName,
    middleName: user?.middleName,
    nickname: user?.nickname,
    preferredUsername: user?.preferredUsername,
  } : undefined), [user]);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setErrors('');
    await Users.getById(userId)
      .then(async (res) => {
        if (res.status === 200) {
          return res.json();
        }
        return Promise.reject(res);
      })
      .then(async (userData) => {
        setUser(userData);
        setLoading(false);
      })
      .catch(async (err) => {
        const debuMsg = 'ERROR: [fetchUser - Users.getById]';
        const mainClbck = () => {
          setErrors('Impossible charger les données de l\'utilisateur');
          setLoading(false);
        };
        requestCatch(err, debuMsg, undefined, undefined, mainClbck);
      });
  }, [setErrors, setLoading, setUser, userId]);

  /**
   * At the mounted state load the current client data
   */
  useEffectOnce(() => {
    fetchUser();
  });

  return (
    <HeaderWrapper icon={IoIosPerson} title="Mise à jour d'un utilisateur">
      <div className={styles.Root}>
        <ProfileInfosForm userId={userId} defaultData={infoData} errorMsg={errors} loading={loading} />

        {/* <ProfileIdentityForm /> */}
        {/* <ProfilePasswordsForm /> */}
        {/* <ProfileLinksForm /> */}
        {/* <ProfileTimezoneForm /> */}
        {/* <ProfileOtherInfos /> */}
      </div>
    </HeaderWrapper>
  );
}

export default React.memo(Update);
