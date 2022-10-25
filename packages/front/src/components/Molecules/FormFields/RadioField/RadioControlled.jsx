import React from 'react';
import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import RadioField from '.';

/**
 * Componant that manage with react-hook-form
 * the InputField component
 */
function RadioControlled({
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
    <RadioField
      onChange={onChange} // send value to hook form
      onBlur={onBlur} // notify when input is touched/blur
      checked={rest?.value === value || false} // input value
      name={hookName} // send down the input name
      ref={ref} // send input ref, so we can focus on input when error appear
      error={error?.message || ''}
      {...rest}
    />
  );
}

RadioControlled.propTypes = {
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  control: PropTypes.object.isRequired,
};

RadioControlled.defaultProps = {
};

export default React.memo(RadioControlled);
