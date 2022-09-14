import React from 'react';
import PropTypes from 'prop-types';

import If from '../../Atoms/If';

import styles from './Alert.module.scss';

/**
 * Component that manage alert component message en severity
 */
function Alert({ severity, title, children }) {
  return (
    <div className={`${styles.Root} ${styles[severity]}`}>
      <If condition={!!title}>
        <p className="subtitle2">{title}</p>
      </If>
      <p className="body2">{children}</p>
    </div>
  );
}

Alert.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  title: PropTypes.string,
  severity: PropTypes.oneOf(['error', 'info', 'success', 'warning', 'default']),
};

Alert.defaultProps = {
  severity: 'default',
  title: '',
  children: undefined,
};

export default React.memo(Alert);
