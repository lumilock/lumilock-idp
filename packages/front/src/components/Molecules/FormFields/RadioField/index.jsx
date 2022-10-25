import React, { useId, useRef } from 'react';
import { PropTypes } from 'prop-types';
import clsx from 'clsx';
import { IoIosRadioButtonOff, IoIosRadioButtonOn } from 'react-icons/io';

import { sizes } from '../../../../services/Theme';
import { Icon, If, Typography } from '../../../Electrons';
import styles from './RadioField.module.scss';

const RadioField = React.forwardRef(({
  className, error, label, size, ...rest
}, ref) => {
  const fieldId = useId();
  const localRef = useRef(null);
  const inputRef = localRef?.current?.children[0]?.children[1];

  return (
    <div ref={localRef} className={clsx(styles.Base, className, styles?.[sizes[size]], inputRef?.disabled && styles.Disabled)}>
      <div className={styles.Icons}>
        <Icon
          ionIcon={inputRef?.checked || rest?.checked ? IoIosRadioButtonOn : IoIosRadioButtonOff}
          size="xsmall"
          color={inputRef?.checked || rest?.checked ? 'content1' : 'content3'}
          className={styles.RadioIcon}
        />
        <Typography component="input" id={fieldId} variant="body1" color="content1" ref={ref} {...rest} type="radio" />
      </div>
      <Typography component="label" htmlFor={fieldId} variant="subtitle1" color={inputRef?.checked ? 'content1' : 'content3'}>{label}</Typography>
      <If condition={!!error}>
        <Typography variant="body2" color="alert">{error}</Typography>
      </If>
    </div>
  );
});

RadioField.propTypes = {
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
};

RadioField.defaultProps = {
  label: '',
  size: 'regular',
  error: '',
  className: '',
};

export default React.memo(RadioField);
