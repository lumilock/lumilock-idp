import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component that allow you to create tertionary conditions properly and readable
 * https://tech.trell.co/cleaner-way-to-write-conditionals-in-jsx-b13fb60b5792
 */
function Choose({ children }) {
  const toReturn = null;
  // check if multiple childs
  if (Array.isArray(children)) {
    for (let index = 0; index < children.length; index += 1) {
      const el = children[index];
      if (el.type?.displayName === 'When' && el.props.condition) {
        return el;
      }
    }
  } else if (children.props.condition) {
    return children;
  }

  // Check if any otherwise component present
  // to use otherwise you must have multiple components
  for (let index = 0; index < children.length; index += 1) {
    const el = children[index];
    if (el.type?.displayName === 'OtherWise') {
      return el;
    }
  }

  return toReturn;
}

Choose.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default React.memo(Choose);

export { default as When } from './When';
export { default as OtherWise } from './OtherWise';
