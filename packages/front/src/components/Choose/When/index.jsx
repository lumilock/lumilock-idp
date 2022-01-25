import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component call in the Choose component if current condition is statisfied
 */
const When = (props) => (
  <>
    {/* disabled because we have hiddens props like condition */}
    {/* eslint-disable-next-line react/destructuring-assignment */}
    {props.children}
  </>
);

When.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  condition: PropTypes.bool, // only used in Choose parent component
};

When.defaultProps = {
  condition: false,
};

When.displayName = 'When';
export default When;
