import React from 'react';
import PropTypes from 'prop-types';

import { Toggle } from '../../Atoms';

import styles from './ToggleSideBar.module.scss';

function ToggleSideBar({ open, children }) {
  return (
    <Toggle visible={!!open} from={{ opacity: 1 }} orientation="horizontal">
      <div className={styles.Root}>
        {children}
      </div>
    </Toggle>
  );
}

ToggleSideBar.propTypes = {
  children: PropTypes.PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  open: PropTypes.bool,
};

ToggleSideBar.defaultProps = {
  open: false,
};

export default React.memo(ToggleSideBar);
