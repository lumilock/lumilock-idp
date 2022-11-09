import React, { useContext, useDeferredValue, useState } from 'react';
import { IoIosAdd, IoIosSearch } from 'react-icons/io';

import { useUpdate } from '../../../services/Hooks';
import { InputField, NavLinkButton } from '../../Molecules';
import UsersContext from '../../../pages/Users/UsersContext';
import styles from './UsersActionBar.module.scss';

function UsersActionBar() {
  // Context
  const { setFilter } = useContext(UsersContext);
  // Local states
  const [value, setValue] = useState('');
  const deferredValue = useDeferredValue(value);

  useUpdate(() => {
    setFilter(deferredValue);
  }, [deferredValue]);

  return (
    <div className={styles.Root}>
      <InputField
        startIcon={IoIosSearch}
        type="text"
        placeholder="search"
        value={value}
        onChange={(e) => setValue(e?.target?.value)}
        variant="outlined"
        className={styles.Search}
      />
      <NavLinkButton
        size="medium"
        variant="outlined"
        to="add"
        iconProps={{
          size: 'small',
          ionIcon: IoIosAdd,
        }}
      />
    </div>
  );
}

export default React.memo(UsersActionBar);
