import React from 'react';
import {
  IoIosApps, IoIosCog, IoIosConstruct, IoIosKey, IoIosPeople,
} from 'react-icons/io';

import { NavBarItem } from '../../Molecules';

function NavBarMenu() {
  return (
    <div>
      <NavBarItem title="Applications" icon={IoIosApps} path="/applications" />
      <NavBarItem title="Services" icon={IoIosConstruct} path="/services" />
      <NavBarItem title="Utilisateurs" icon={IoIosPeople} path="/users" />
      <NavBarItem title="Clefs" icon={IoIosKey} path="/keys" />
      <NavBarItem title="Paramètres" icon={IoIosCog} path="/settings" />
    </div>
  );
}

export default React.memo(NavBarMenu);
