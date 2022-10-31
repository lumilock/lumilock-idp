import React, { useId } from 'react';
import { PropTypes } from 'prop-types';
import clsx from 'clsx';
import { IoIosCheckbox, IoIosSquareOutline } from 'react-icons/io';

import { remCalc } from '../../../../services/Tools';
import { sizes } from '../../../../services/Theme';
import {
  Else, Icon, If, Skeleton, Then, Typography,
} from '../../../Electrons';
import styles from './CheckboxField.module.scss';

const CheckboxField = React.forwardRef(({
  className, error, label, size, hideError, loading, disabled, ...rest
}, ref) => {
  const fieldId = useId();

  return (
    <div className={clsx(styles.Base, className, styles?.[sizes[size]], (disabled || loading) && styles.Disabled)}>
      <If condition={loading}>
        <Then>
          <Skeleton variant="rounded" height={remCalc(24)} width="100%" animation="wave" />
          <Skeleton height={remCalc(24)} width="100%" animation="wave" style={{ marginLeft: remCalc(8) }} />
        </Then>
        <Else>
          <>
            <div className={styles.Icons}>
              <Icon
                ionIcon={rest?.checked ? IoIosCheckbox : IoIosSquareOutline}
                size="xsmall"
                color={rest?.checked ? 'content1' : 'content3'}
                className={styles.RadioIcon}
              />
              <Typography component="input" id={fieldId} variant="body1" color="content1" ref={ref} {...rest} type="checkbox" disabled={(disabled || loading) && 'disabled'} />
            </div>
            <Typography component="label" htmlFor={fieldId} variant="subtitle1" color={rest?.checked ? 'content1' : 'content3'}>{label}</Typography>
          </>
        </Else>
      </If>
      <If condition={!!error && !hideError}>
        <Typography className={styles.HelperText} variant="body2" color="alert">{error}</Typography>
      </If>
    </div>
  );
});

CheckboxField.propTypes = {
  /**
     * The label of the current inupt
     */
  label: PropTypes.string,
  /**
     * Define the size of the input
     */
  size: PropTypes.oneOf(sizes),
  /**
     * The error message to display under the input
     */
  error: PropTypes.string,
  /**
     * All class to pass to the input container div
     */
  className: PropTypes.string,
  /**
     * If true will display the error if there is an error message
     */
  hideError: PropTypes.bool,
  /**
   * define if the component is loading
   */
  loading: PropTypes.bool,
  /**
   * define if the component is disabled
   */
  disabled: PropTypes.bool,
};

CheckboxField.defaultProps = {
  label: '',
  size: 'regular',
  error: '',
  className: '',
  hideError: false,
  loading: false,
  disabled: false,
};

export default React.memo(CheckboxField);
