import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';
import { capitalize } from '../../../services/Tools';
import If from '../../Electrons/If';
import styles from './Alert.module.scss';

/**
 * Component that manage alert component message en severity
 */
function Alert({
  severity, variant, title, className, children,
}) {
  return (
    <div className={clsx(styles.Root, styles[capitalize(severity)], styles[capitalize(variant)], className)}>
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
  className: PropTypes.string,
  severity: PropTypes.oneOf(['error', 'info', 'success', 'warning', 'default']),
  variant: PropTypes.oneOf(['squared', 'rounded']),
};

Alert.defaultProps = {
  severity: 'default',
  variant: 'squared',
  title: '',
  className: '',
  children: undefined,
};

export default React.memo(Alert);
