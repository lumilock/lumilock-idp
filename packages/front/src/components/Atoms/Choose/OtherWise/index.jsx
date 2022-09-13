import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component call in the Choose component if any condition is statisfied
 */
const OtherWise = (props) => (
  <>
    {/* disabled because we have hiddens props like condition */}
    {/* eslint-disable-next-line react/destructuring-assignment */}
    {props.children}
  </>
);

OtherWise.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  condition: PropTypes.bool, // only used in Choose parent component
};

OtherWise.defaultProps = {
  condition: false,
};

OtherWise.displayName = 'OtherWise';
export default OtherWise;
