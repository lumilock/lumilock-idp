import React, { useId, useMemo } from 'react';
import { PropTypes } from 'prop-types';
import clsx from 'clsx';

import { sizes } from '../../../../services/Theme';
import { remCalc } from '../../../../services/Tools';
import {
  Else, Icon, If, Skeleton, Then, Typography,
} from '../../../Electrons';
import styles from './InputField.module.scss';

const InputField = React.forwardRef(({
  startIcon, endIcon, className, error, label, size, variant, loading, disabled, ...rest
}, ref) => {
  const fieldId = useId();
  const variantClasses = useMemo(() => ({
    outlined: 'Outlined',
    standard: 'Standard',
  }), []);

  return (
    <div className={clsx(styles.Base, className, styles?.[sizes[size]], styles?.[variantClasses[variant]], (disabled || loading) && styles.Disabled)}>
      <If condition={loading}>
        <Then>
          <Skeleton height={remCalc(15)} width="25%" animation="wave" />
          <Skeleton variant="rounded" height={remCalc(24)} width="100%" animation="wave" />
        </Then>
        <Else>
          <Typography component="label" htmlFor={fieldId} variant="subtitle2" color="content3">{label}</Typography>
          <div className={styles.Input}>
            <If condition={!!startIcon}>
              <Icon ionIcon={startIcon} size="xsmall" color="content3" />
            </If>
            <Typography component="input" id={fieldId} variant="body1" color="content1" ref={ref} {...rest} disabled={(disabled || loading) && 'disabled'} />
            <If condition={!!endIcon}>
              <Icon ionIcon={endIcon} size="xsmall" color="content3" />
            </If>
          </div>
        </Else>
      </If>
      <If condition={!!error}>
        <Typography variant="body2" color="alert">{error}</Typography>
      </If>
    </div>
  );
});

InputField.propTypes = {
  /**
   * The label of the current inupt
   */
  label: PropTypes.string,
  /**
   * Define the size of the input
   */
  size: PropTypes.oneOf(sizes),
  /**
   * Define the variant of the input
   */
  variant: PropTypes.oneOf(['outlined', 'standard']),
  /**
   * The error message to display under the input
   */
  error: PropTypes.string,
  /**
   * All class to pass to the input container div
   */
  className: PropTypes.string,
  /**
   * define if the component is loading
   */
  loading: PropTypes.bool,
  /**
   * define if the component is disabled
   */
  disabled: PropTypes.bool,
  /**
   * Icon on the left of the input
   */
  startIcon: PropTypes.func,
  /**
   * Icon on the right of the input
   */
  endIcon: PropTypes.func,
};
InputField.defaultProps = {
  label: '',
  size: 'regular',
  variant: 'standard',
  error: '',
  className: '',
  loading: false,
  disabled: false,
  startIcon: undefined,
  endIcon: undefined,
};

export default React.memo(InputField);
