import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { colors, sizes } from '../../../services/Theme';
import styles from './Spinner.module.scss';

function Spinner({ color, size }) {
  return (
    <div className={clsx(styles.CubeGrid, styles?.[sizes?.[size]], styles?.[colors?.[color]])}>
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

Spinner.propTypes = {
  color: PropTypes.oneOf(colors),
  size: PropTypes.oneOf(sizes),
};

Spinner.defaultProps = {
  size: 'small',
  color: 'content1',
};

export default React.memo(Spinner);
