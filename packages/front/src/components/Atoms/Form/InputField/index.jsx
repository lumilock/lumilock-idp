import React from 'react';
import PropTypes from 'prop-types';

// Components
import If from '../../../Electrons/If';

// local
import styles from './InputField.module.scss';

/**
 * Component that manage an input
 */
function InputField({
  label, name, type, error, className, inputRef, ...rest
}) {
  return (
    <div className={`${styles.Container} ${className || ''}`}>
      <label htmlFor={name} className="subtitle1">{label}</label>
      <input name={name} id={name} type={type} className="body1" ref={inputRef} {...rest} />
      <If condition={!!error}>
        <p className={`${styles.HelperText} body2`}>{error}</p>
      </If>
    </div>
  );
}

InputField.propTypes = {
  /**
   * The label of the current inupt
   */
  label: PropTypes.string.isRequired,
  /**
   * A reference passed to the input
   */
  inputRef: PropTypes.func,
  /**
   * The name and id of the input
   */
  name: PropTypes.string.isRequired,
  /**
   * Type accepted by the input
   */
  type: PropTypes.oneOf(['text', 'number', 'password', 'time', 'email']),
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
  inputRef: undefined,
  type: 'text',
  error: '',
  className: '',
};

export default React.memo(InputField);
