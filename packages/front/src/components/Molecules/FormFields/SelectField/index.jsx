import React, { useId, useMemo } from 'react';
import { PropTypes } from 'prop-types';
import clsx from 'clsx';

import { sizes } from '../../../../services/Theme';
import {
  Else, If, Skeleton, Then, Typography,
} from '../../../Electrons';
import styles from './SelectField.module.scss';
import { remCalc } from '../../../../services/Tools';

function Options({ placeholder, options }) {
  return (
    <>
      <If condition={!!placeholder}>
        <Typography component="option" value="" variant="body1" color="content3">{placeholder}</Typography>
      </If>
      {options?.map((option) => (
        <React.Fragment key={option?.value || option}>
          <If condition={!Array.isArray(option?.value)}>
            {/* Default case if we have normal options */}
            <Then>
              <Typography
                component="option"
                variant="body1"
                color="content1"
                value={option?.value || option}
              >
                {option?.label || option}
              </Typography>
            </Then>
            {/* Case if we have options groups */}
            <Else>
              <Typography
                component="optgroup"
                variant="body1"
                color="content2"
                label={option?.label}
              >
                {Array.isArray(option?.value) && option?.value?.map((o) => (
                  <Typography
                    component="option"
                    variant="body1"
                    color="content1"
                    key={o?.value || o}
                    value={o?.value || o}
                  >
                    {o?.label || o}
                  </Typography>
                ))}
              </Typography>
            </Else>
          </If>
        </React.Fragment>
      ))}
    </>
  );
}

Options.propTypes = {
  /**
   * The placeholder of the current inupt
   */
  placeholder: PropTypes.string,
  /**
   * All select options
   */
  options: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      value: PropTypes.oneOfType([
        PropTypes.arrayOf(
          PropTypes.shape({
            // eslint-disable-next-line react/forbid-prop-types
            value: PropTypes.any,
            // eslint-disable-next-line react/forbid-prop-types
            label: PropTypes.any,
          }),
          PropTypes.any,
        ),
        PropTypes.any,
      ]),
      // eslint-disable-next-line react/forbid-prop-types
      label: PropTypes.any,
    }),
    PropTypes.string,
  ])),
};

Options.defaultProps = {
  placeholder: '',
  options: [],
};

const SelectField = React.forwardRef(({
  className, error, label, size, variant, options, placeholder, loading, disabled, ...rest
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
          <Typography component="select" id={fieldId} variant="body1" color="content1" ref={ref} {...rest} disabled={(disabled || loading) && 'disabled'}>
            <Options placeholder={placeholder} options={options} />
          </Typography>
        </Else>
      </If>
      <If condition={!!error}>
        <Typography variant="body2" color="alert">{error}</Typography>
      </If>
    </div>
  );
});

SelectField.propTypes = {
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
   * The placeholder of the current inupt
   */
  placeholder: PropTypes.string,
  /**
   * All select options
   */
  options: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      value: PropTypes.oneOfType([
        PropTypes.arrayOf(
          PropTypes.shape({
            // eslint-disable-next-line react/forbid-prop-types
            value: PropTypes.any,
            // eslint-disable-next-line react/forbid-prop-types
            label: PropTypes.any,
          }),
          PropTypes.any,
        ),
        PropTypes.any,
      ]),
      // eslint-disable-next-line react/forbid-prop-types
      label: PropTypes.any,
    }),
    PropTypes.any,
  ])),
};

SelectField.defaultProps = {
  label: '',
  size: 'regular',
  variant: 'standard',
  error: '',
  className: '',
  loading: false,
  disabled: false,
  placeholder: '',
  options: [],
};

export default React.memo(SelectField);
