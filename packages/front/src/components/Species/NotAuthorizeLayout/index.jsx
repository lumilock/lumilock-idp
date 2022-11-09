import React from 'react';

import { Typography } from '../../Electrons';
import styles from './NotAuthorizeLayout.module.scss';

function NotAuthorizeLayout() {
  return (
    <div className={styles.Root}>
      <Typography variant="h1" color="content1">non autorisé</Typography>
      <Typography variant="subtitle1" color="content1">Vous n&apos;êtes pas autorizé à accèder à cette page</Typography>
    </div>
  );
}

NotAuthorizeLayout.propTypes = {
};

export default React.memo(NotAuthorizeLayout);
