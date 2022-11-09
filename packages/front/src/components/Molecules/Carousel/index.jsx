import React, { useCallback, useMemo } from 'react';
import { PropTypes } from 'prop-types';

import CarouselItem from './CarouselItem';
import styles from './Carousel.module.scss';

const Carousel = React.forwardRef(({ selected, children }, ref) => {
  // Methods to check childrens before displaying them
  const child = useCallback(() => {
    if (Array.isArray(children) && (children?.filter((c) => c?.type?.displayName !== 'CarouselItem').length === 0)) {
      // Adding some default props to all childrens
      const populateChildren = React.Children.map(children, (c, i) => {
        if (!React.isValidElement(c)) {
          return null;
        }
        return React.cloneElement(c, {
          ...c.props,
          selected: selected === i,
          index: i,
        });
      });
      return populateChildren;
    } if (!Array.isArray(children) && children?.type?.displayName === 'CarouselItem') {
      // Adding some default props to the child
      const populateChild = React.cloneElement(children, {
        ...children.props,
        selected: true,
        index: 0,
      });
      return populateChild;
    }
    return null;
  }, [children, selected]);

  const Children = useMemo(() => child(), [child]);

  return (
    <div
      className={styles.Base}
      ref={ref}
    >
      {Children}
    </div>
  );
});

/**
 * custom proptypes validator to check if children are from Type <CarouselItem />
 */
const carouselValidator = ({ children }, propName, componentName) => {
  // If only one Node
  if (React.isValidElement(children) && children.type?.displayName === 'CarouselItem') {
    return null;
  }

  // If array of multiple children
  if (Array.isArray(children) && (children?.filter((c) => c?.type?.displayName !== 'CarouselItem').length === 0)) {
    return null;
  }

  return new Error(
    `Invalid prop ${propName} supplied to ${componentName}. Validation failed.
    Needs to be a node: <CarouselItem /> or an array of nodes: <CarouselItem />.
    You provided : [${children}]`,
  );
};

Carousel.propTypes = {
  selected: PropTypes.number,
  children: carouselValidator,
};

Carousel.defaultProps = {
  selected: 0,
  children: undefined,
};

const CarouselMemo = React.memo(Carousel);
CarouselMemo.displayName = 'Carousel';
export default CarouselMemo;

export {
  CarouselItem,
};
