import React from 'react';
import PropTypes from 'prop-types';

import styles from './CarouselItem.module.scss';

const CarouselItem = React.forwardRef(({
  index, selected, enter, leave, children,
}, ref) => (
  <div
    className={`${[
      styles?.Base,
      selected ? styles.Active : '',
      enter === 'right' ? styles.EnterRight : styles.EnterLeft,
      leave === 'left' ? styles.LeaveLeft : styles.LeaveRight,
    ].join(' ').trim()}`}
    ref={ref}
  >
    {index}
    {children}
  </div>
));

CarouselItem.propTypes = {
  /**
   * Index of the Current item in the parent list
   */
  index: PropTypes.number.isRequired,
  /**
   * Boolean to determine if the item is visible
   */
  selected: PropTypes.bool,
  /**
   * The initial position of the item before the animation
   */
  enter: PropTypes.oneOf(['left', 'right']),
  /**
   * The final position of the item after the animation
   */
  leave: PropTypes.oneOf(['left', 'right']),
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

CarouselItem.defaultProps = {
  selected: false,
  enter: 'right',
  leave: 'left',
};

const CarouselItemMemo = React.memo(CarouselItem);
CarouselItemMemo.displayName = 'CarouselItem';

export default CarouselItemMemo;
