import PropTypes from 'prop-types';

/**
 * Component call in the if compoenent if the condition is false
 */
function Else({ children }) {
  return [children];
}

Else.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
Else.displayName = 'Else';
export default Else;
