import React from 'react';
import PropTypes from 'prop-types';

import { pascalCase } from '../../../services/Tools';
import colors from '../../../services/Theme/colors';
import If, { Else, Then } from '../If';
import styles from './Typography.module.scss';

const Typography = React.forwardRef(({
  variant, component, paragraph, className, color, ellipsis, children, ...rest
}, ref) => {
  const defaultVariantMapping = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle1: 'p',
    subtitle2: 'p',
    body1: 'p',
    body2: 'p',
    inherit: 'p',
  };

  const Component = component
    || (paragraph ? 'p' : defaultVariantMapping[variant])
    || 'span';

  const classes = [
    `${styles?.Base}`,
    className ? ` ${className}` : '',
    ellipsis ? ` ${styles.Ellipsis}` : '',
    ['subtitle1', 'subtitle2', 'body1', 'body2'].includes(variant) ? ` ${variant}` : '',
    ` ${styles?.[pascalCase(color)]}`,
  ].join('');

  return (
    <If condition={!!children}>
      <Then>
        <Component className={classes} ref={ref} {...rest}>{children}</Component>
      </Then>
      <Else>
        <Component className={classes} ref={ref} {...rest} />
      </Else>
    </If>
  );
});

Typography.propTypes = {
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * If `true`, the element will be a paragraph element.
   * @default false
   */
  paragraph: PropTypes.bool,
  /**
   * If `true`, the element overflow with ellipsis.
   * @default false
   */
  ellipsis: PropTypes.bool,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * custom classes
   */
  className: PropTypes.string,
  /**
   * text color variations
   */
  color: PropTypes.oneOf(colors),
  /**
   * Applies the theme typography styles.
   * @default 'body1'
   */
  variant: PropTypes.oneOfType([
    PropTypes.oneOf([
      'body1',
      'body2',
      'button',
      'caption',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'inherit',
      'overline',
      'subtitle1',
      'subtitle2',
    ]),
    PropTypes.string,
  ]),
};

Typography.defaultProps = {
  className: '',
  paragraph: false,
  ellipsis: false,
  component: undefined,
  variant: 'body1',
  children: '',
  color: 'content1',
};

export default React.memo(Typography);
