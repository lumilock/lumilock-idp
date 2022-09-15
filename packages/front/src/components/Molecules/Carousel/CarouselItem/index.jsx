import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';

// import { usePrevious } from '../../../../services/Hooks';
import styles from './CarouselItem.module.scss';
import { pascalCase } from '../../../../services/Tools';

const CarouselItem = React.forwardRef(({
  index, selected, enter, leave, children,
}, ref) => {
  const nodeRef = useRef(ref);

  return (
    <CSSTransition
      in={selected}
      timeout={500}
      unmountOnExit
      classNames={{
        appear: styles.Slide,
        appearActive: styles.SlideActive,
        appearDone: styles.SlideDone,
        enter: styles.SlideEnter,
        enterActive: `${[styles.SlideEnterActive, styles?.[pascalCase(enter)]].join(' ').trim()}`,
        enterDone: `${[styles.SlideEnterDone, styles?.[pascalCase(enter)]].join(' ').trim()}`,
        exit: styles.SlideExit,
        exitActive: `${[styles.SlideExiteActive, styles?.[pascalCase(leave)]].join(' ').trim()}`,
        exitDone: `${[styles.SlideExitDone, styles?.[pascalCase(leave)]].join(' ').trim()}`,
      }}
      nodeRef={nodeRef}
    >
      <div
        key={index}
        className={`${[
          styles?.Base,
          selected ? styles.Active : '',
        ].join(' ').trim()}`}
        ref={nodeRef}
      >
        {children}
      </div>
    </CSSTransition>
  );
});

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
