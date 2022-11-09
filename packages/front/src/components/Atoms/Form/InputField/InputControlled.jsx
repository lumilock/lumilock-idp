import React from 'react';
import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import InputField from '.';

/**
 * Componant that manage with react-hook-form
 * the InputField component
 */
function InputControlled({
  name, control, ...rest
}) {
  // React Hook Form
  const {
    field: {
      onChange, onBlur, name: hookName, value, ref,
    },
    fieldState: { error },
  } = useController({ name, control });

  return (
    <InputField
      onChange={onChange} // send value to hook form
      onBlur={onBlur} // notify when input is touched/blur
      value={value || ''} // input value
      name={hookName} // send down the input name
      inputRef={ref} // send input ref, so we can focus on input when error appear
      error={error?.message || ''}
      {...rest}
    />
  );
}

InputControlled.propTypes = {
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  control: PropTypes.object.isRequired,
};

InputControlled.defaultProps = {
};

export default React.memo(InputControlled);
