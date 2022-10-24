import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '../../Electrons';
import styles from './LinkButton.module.scss';

function LinkButton({
  loading, disabled, iconProps, ...rest
}) {
  return (
    <a {...rest} className={styles.Base} disabled={disabled ? 'disabled' : ''}>
      <Icon
        loading={loading}
        {...iconProps}
      />
    </a>
  );
}

LinkButton.propTypes = {
  /**
   * Determine if the link is disabled
   */
  disabled: PropTypes.bool,
  /**
   * All available props for Icon component
   */
  // eslint-disable-next-line react/forbid-prop-types
  iconProps: PropTypes.object,
  /**
   * Determine if the link is loading
   */
  loading: PropTypes.bool,
};

LinkButton.defaultProps = {
  disabled: false,
  iconProps: {},
  loading: false,
};

export default React.memo(LinkButton);
