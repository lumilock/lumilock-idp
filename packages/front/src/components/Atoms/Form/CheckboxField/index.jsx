import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { IoCheckbox, IoSquareOutline } from 'react-icons/io5';

// Components
import If from '../../If';
import Icon from '../../Icon';

// local
import styles from './CheckboxField.module.scss';

/**
 * Component that manage an input
 */
function CheckboxField({
  label, name, error, className, checked, inputRef, onChange, ...rest
}) {
  // State
  const [isChecked, setIsChecked] = useState(checked);

  /**
   * change local and external state
   */
  const handleChange = useCallback(
    (e) => {
      setIsChecked(e.target.checked);
      onChange(e);
    },
    [onChange],
  );

  /**
   * Switch local and external state when clicking on icon
   */
  const handleClick = useCallback(
    (chck) => {
      const event = new Event('change', { bubbles: true });
      Object.defineProperty(event, 'target', { writable: false, value: { value: !chck, name } });
      setIsChecked((c) => !c);
      onChange(event);
    },
    [name, onChange],
  );

  // Update local state from external state
  useEffect(() => {
    setIsChecked((c) => (c !== checked ? checked : c));
  }, [checked]);

  return (
    <div className={`${styles.Container} ${className || ''}`}>
      <div className={styles.Checkbox}>
        <Icon
          ionIcon={isChecked ? IoCheckbox : IoSquareOutline}
          size="xsmall"
          onClick={() => handleClick(isChecked)}
          className={styles.CheckboxIcon}
        />
        <input onChange={handleChange} type="checkbox" name={name} id={name} className="body1" ref={inputRef} checked={isChecked} {...rest} />
        <label htmlFor={name} className="subtitle1">{label}</label>
      </div>
      <If condition={!!error}>
        <p className={`${styles.HelperText} body2`}>{error}</p>
      </If>
    </div>
  );
}

CheckboxField.propTypes = {
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
   * The error message to display under the input
   */
  error: PropTypes.string,
  /**
   * All class to pass to the input container div
   */
  className: PropTypes.string,
  /**
   * value of the checkbox
   */
  checked: PropTypes.bool,
  /**
   * function fired when state is changed
   */
  onChange: PropTypes.func,
};

CheckboxField.defaultProps = {
  inputRef: undefined,
  error: '',
  className: '',
  checked: false,
  onChange: () => {},
};

export default React.memo(CheckboxField);
