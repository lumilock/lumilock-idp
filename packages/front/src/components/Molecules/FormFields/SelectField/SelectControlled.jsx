import React from 'react';
import PropTypes from 'prop-types';
import { useController } from 'react-hook-form';
import SelectField from '.';

/**
 * Componant that manage with react-hook-form
 * the SelectField component
 */
function SelectControlled({
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
    <SelectField
      onChange={onChange} // send value to hook form
      onBlur={onBlur} // notify when input is touched/blur
      value={value || ''} // input value
      name={hookName} // send down the input name
      ref={ref} // send input ref, so we can focus on input when error appear
      error={error?.message || ''}
      {...rest}
    />
  );
}

SelectControlled.propTypes = {
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  control: PropTypes.object.isRequired,
};

SelectControlled.defaultProps = {
};

export default React.memo(SelectControlled);
