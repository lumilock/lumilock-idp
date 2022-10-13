import React from 'react';
import PropTypes from 'prop-types';

import { pascalCase } from '../../../services/Tools';
import colors from '../../../services/Theme/colors';
import styles from './Typography.module.scss';

function Typography({
  variant, component, paragraph, className, color, children,
}) {
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
    ['subtitle1', 'subtitle2', 'body1', 'body2'].includes(variant) ? ` ${variant}` : '',
    ` ${styles?.[pascalCase(color)]}`,
  ].join('');

  return (
    <Component className={classes}>{children}</Component>
  );
}

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
  component: undefined,
  variant: 'body1',
  children: '',
  color: 'content1',
};

export default React.memo(Typography);
