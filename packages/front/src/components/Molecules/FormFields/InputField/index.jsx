import React, { useId, useMemo } from 'react';
import { PropTypes } from 'prop-types';
import clsx from 'clsx';

import { If, Typography } from '../../../Electrons';
import styles from './InputField.module.scss';
import { sizes } from '../../../../services/Theme';

const InputField = React.forwardRef(({
  className, error, label, size, variant, ...rest
}, ref) => {
  const fieldId = useId();
  const variantClasses = useMemo(() => ({
    outlined: 'Outlined',
    standard: 'Standard',
  }), []);

  return (
    <div className={clsx(styles.Base, className, styles?.[sizes[size]], styles?.[variantClasses[variant]])}>
      <Typography component="label" htmlFor={fieldId} variant="subtitle1" color="content3">{label}</Typography>
      <Typography component="input" id={fieldId} variant="body1" color="content1" ref={ref} {...rest} />
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
};
InputField.defaultProps = {
  label: '',
  size: 'regular',
  variant: 'standard',
  error: '',
  className: '',
};

export default React.memo(InputField);
