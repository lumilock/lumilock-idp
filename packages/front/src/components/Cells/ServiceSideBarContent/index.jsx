import React from 'react';

import { ServiceProfile } from '../../Molecules';
import styles from './ServiceSideBarContent.module.scss';

function ServiceSideBarContent() {
  return (
    <div className={styles.Root}>
      <ServiceProfile loading />
    </div>
  );
}

export default React.memo(ServiceSideBarContent);
