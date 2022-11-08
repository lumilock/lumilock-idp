import clsx from 'clsx';
import React from 'react';

import styles from './Spinner.module.scss';

function Spinner() {
  return (
    <div className={styles.CubeGrid}>
      <div className={clsx(styles.Cube, styles.Cube1)} />
      <div className={clsx(styles.Cube, styles.Cube2)} />
      <div className={clsx(styles.Cube, styles.Cube3)} />
      <div className={clsx(styles.Cube, styles.Cube4)} />
      <div className={clsx(styles.Cube, styles.Cube5)} />
      <div className={clsx(styles.Cube, styles.Cube6)} />
      <div className={clsx(styles.Cube, styles.Cube7)} />
      <div className={clsx(styles.Cube, styles.Cube8)} />
      <div className={clsx(styles.Cube, styles.Cube9)} />
    </div>
  );
}

export default React.memo(Spinner);
