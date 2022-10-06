import React from 'react';
import PropTypes from 'prop-types';

import { pascalCase } from '../../../services/Tools';
import styles from './Skeleton.module.scss';

function Skeleton({
  animation, className, component, height, width, variant, ...rest
}) {
  const Component = component || 'span';

  return (
    <Component
      className={[
        styles.Base,
        className,
        animation ? styles?.[pascalCase(animation)] : '',
        styles?.[pascalCase(variant)],
      ].join(' ').trim()}
      style={{
        height,
        width,
      }}
      {...rest}
    />
  );
}

Skeleton.propTypes = {
  /**
* The animation.
* If `false` the animation effect is disabled.
* @default 'pulse'
*/
  animation: PropTypes.oneOf(['pulse', 'wave', false]),
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * Height of the skeleton.
   * Useful when you don't want to adapt the skeleton to a text element but for instance a card.
   */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /**
   * The type of content that will be rendered.
   * @default 'text'
   */
  variant: PropTypes.oneOfType([
    PropTypes.oneOf(['circular', 'rectangular', 'rounded', 'text']),
    PropTypes.string,
  ]),
  /**
   * Width of the skeleton.
   * Useful when the skeleton is inside an inline element with no width of its own.
   */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

Skeleton.defaultProps = {
  animation: 'pulse',
  className: '',
  component: 'span',
  height: '',
  variant: 'text',
  width: '',
};

export default React.memo(Skeleton);
