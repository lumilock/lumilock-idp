import React, { useContext, useDeferredValue, useState } from 'react';
import { IoIosAdd, IoIosSearch } from 'react-icons/io';

import { useUpdate } from '../../../services/Hooks';
import { InputField, NavLinkButton } from '../../Molecules';
import ServicesContext from '../../../pages/Services/ServicesContext';
import styles from './ServicesActionBar.module.scss';

function ServicesActionBar() {
  // Context
  const { setFilter } = useContext(ServicesContext);
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

export default React.memo(ServicesActionBar);
