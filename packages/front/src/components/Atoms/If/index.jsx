import React from 'react';
import PropTypes from 'prop-types';

import Then from './Then';
import Else from './Else';

/**
 * This props was created to replace conditional if in the jsx
 * from :
 *  { condition && (<JSX />)}
 * to :
 *  <If condition> <JSX /> </If>
 * other, from:
 *  {
 *    condition ? (
 *    <JSX1 />
 *  ) : (
 *    <JSX2 />
 *  )}
 * to:
 *  <If condition>
 *    <Then> <JSX1 /> </Then>
 *    <Else> <JSX2 /> </Else>
 *  </Else>
 * https://tech.trell.co/cleaner-way-to-write-conditionals-in-jsx-b13fb60b5792
 */
const If = ({ condition, children }) => {
  if (Array.isArray(children) && children.length === 2) {
    const then = children[0];
    const otherWise = children[1];
    if (condition && then?.type?.displayName === 'Then') {
      return then;
    }
    if (!condition && otherWise?.type?.displayName === 'Else') {
      return otherWise;
    }
  }
  if (!Array.isArray(children) && condition && children?.type?.displayName !== 'Else') {
    return children;
  }
  return null;
};

/**
 * All possibles errors for our custom propTypes validator
 */
const customErrorMessage = (el) => {
  if (Array.isArray(el)) {
    if (el.length !== 2) {
      return `You provided ${el.length} childrens.`;
    }
    if (el[0].type?.displayName !== 'Then' || el[1].type?.displayName !== 'Else') {
      return 'You provided 2 children but you need to respect the type and the order of these childs 1. <Then /> 2. <Else />.';
    }
  }
  if (el.type?.displayName === 'Then') {
    return 'You only provided a <Then /> component add an <Else /> or directly return your node element without <Then /> or <Else />';
  }
  if (el.type?.displayName === 'Else') {
    return 'You only provided an <Else /> component add a <Then /> or directly return your node element without <Then /> or <Else />';
  }
  return `You provided : [${el}]`;
};

/**
 * custom proptypes validator to check if children are oneOfType (Node or [<Then />; <Else />])
 */
const ifValidator = ({ children }, propName, componentName) => {
  // If Node
  if (React.isValidElement(children) && children.type?.displayName !== 'Then' && children.type?.displayName !== 'Else') {
    return null;
  }
  // If array of 2 children
  if (Array.isArray(children) && (children.length === 2 && children[0].type?.displayName === 'Then' && children[1].type?.displayName === 'Else')) {
    return null;
  }
  return new Error(
    `Invalid prop ${propName} supplied to ${componentName}. Validation failed.
    Needs to be a node or an array of two elements first: <Then>; second : <Else>.
    ${customErrorMessage(children)}`,
  );
};

If.propTypes = {
  condition: PropTypes.bool,
  children: ifValidator,
};

If.defaultProps = {
  condition: false,
};

export default React.memo(If);

export {
  Then,
  Else,
};
