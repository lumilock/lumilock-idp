import React, { useCallback } from 'react';
import {
  IoIosApps, IoIosCog, IoIosConstruct, IoIosKey, IoIosPeople,
} from 'react-icons/io';
import { useSelector } from 'react-redux';

import { permissionsSelector } from '../../../store/auth/authSelector';
import { If } from '../../Electrons';
import { NavBarItem } from '../../Molecules';

function NavBarMenu() {
  const { role, permissions } = useSelector(permissionsSelector);

  /**
   * Check if the user has one of the required permissions
   */
  const shouldHave = useCallback(
    (authPermissions) => {
      if (role === 'none') return false;
      if (role === 'admin') return true;
      if (permissions?.length === 0 && authPermissions?.length > 0) return false;
      return (permissions?.length > 0 && permissions?.some((el) => authPermissions.includes(el)));
    },
    [permissions, role],
  );

  return (
    <div>
      <NavBarItem title="Applications" icon={IoIosApps} path="/applications" />
      <If condition={shouldHave(['clients'])}>
        <NavBarItem title="Services" icon={IoIosConstruct} path="/services" />
      </If>
      <If condition={shouldHave(['users'])}>
        <NavBarItem title="Utilisateurs" icon={IoIosPeople} path="/users" />
      </If>
      {/* TODO */}
      <If condition={shouldHave(['hide']) && false}>
        <>
          <NavBarItem title="Clefs" icon={IoIosKey} path="/keys" />
          <NavBarItem title="Paramètres" icon={IoIosCog} path="/settings" />
        </>
      </If>
    </div>
  );
}

export default React.memo(NavBarMenu);
