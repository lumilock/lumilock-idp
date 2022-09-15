import PropTypes from 'prop-types';

/**
 * Component call in the if compoenent if the condition is true
 */
function Then({ children }) {
  return [children];
}

Then.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
Then.displayName = 'Then';
export default Then;
