import React, { useEffect, useState } from 'react';

import { Toggle } from '../../Atoms';

import styles from './ServicesSideBar.module.scss';

// TODO Remove
// eslint-disable-next-line react/prop-types
function Square({ text }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setN((n2) => n2 + 1), 1000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div
      style={{ width: 100, height: 100, backgroundColor: 'lightGrey' }}
    >
      {text}
      {n}
    </div>
  );
}

function ServiceSideBar() {
  const [open, setOpen] = useState('Hello world');

  const toggle = () => setOpen((o) => (o === '' ? 'Hello world' : ''));
  return (
    <div className={styles.Root}>
      <button type="button" onClick={toggle}>Afficher/Masquer</button>
      <Toggle visible={!!open} from={{ opacity: 1 }} orientation="horizontal">
        <div className={styles.Root}>
          <Square text={open} />
        </div>
      </Toggle>
    </div>
  );
}

export default React.memo(ServiceSideBar);
