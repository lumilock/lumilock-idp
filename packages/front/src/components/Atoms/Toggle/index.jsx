import React, {
  useCallback,
  useMemo, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { useEffectOnce, useUpdate } from '../../../services/Hooks';

import styles from './Toggle.module.scss';
import { remCalc } from '../../../services/Tools';

// State machine constantes
const VISIBLE = 1;
const HIDDEN = 2;
const ENTERING = 3;
const LEAVING = 4;

function Toggle({
  visible, duration, animateEnter, from, orientation, children,
}) {
  // Refs
  const containerRef = useRef(null);
  const childRef = useRef(children); // Previous state
  // Memo
  const checkAnimateEnter = useMemo(() => (animateEnter ? ENTERING : VISIBLE), [animateEnter]);
  // Transition state
  const [state, setState] = useState(visible ? checkAnimateEnter : HIDDEN);
  const [size, setSize] = useState(remCalc(orientation === 'vertical' ? containerRef.current?.clientHeight : containerRef.current?.clientWidth));

  if (visible) {
    childRef.current = children;
  }

  // Get the dimension (height or width) we want to change
  const getDimension = useCallback(
    () => (remCalc(orientation === 'vertical' ? containerRef.current?.clientHeight : containerRef.current?.clientWidth)),
    [orientation],
  );

  // Watching the visible property
  useUpdate(() => {
    if (!visible) {
      setState(LEAVING);
    } else {
      setState((s) => (s === HIDDEN ? ENTERING : VISIBLE));
    }
  }, [visible]);

  // Watching the state and duration properties
  useUpdate(() => {
    if (state === LEAVING) {
      const timer = window.setTimeout(() => {
        setState(HIDDEN);
      }, duration);
      return () => {
        window.clearTimeout(timer);
      };
    } if (state === ENTERING) {
      // eslint-disable-next-line no-unused-expressions
      document.body.offsetHeight; // force the browser to paint animation
      setState(VISIBLE);
      // each time state is ENTERING we recalculate the size of the component
      setSize(getDimension());
    }
    return () => {};
  }, [duration, state]);

  // at the mounted state we initialise the size of the component
  useEffectOnce(() => setSize(getDimension()));

  // When the component is in the HIDDEN state we destoy it
  if (state === HIDDEN) return null;

  // Dynamic styles properties
  const style = {
    transitionDuration: `${duration}ms`,
    transitionProperty: 'opacity transform width height',
  };
  if (state !== VISIBLE) {
    if (from?.opacity !== undefined) {
      style.opacity = from.opacity;
    }
    style.transform = `translate3d(${remCalc(from?.x ?? 0)}, ${remCalc(from?.y ?? 0)}, ${remCalc(from?.z ?? 0)})`;
    if (orientation === 'vertical') {
      style.maxHeight = 0;
    } else {
      style.maxWidth = 0;
    }
  } else if (state === VISIBLE) {
    if (orientation === 'vertical') {
      style.maxHeight = size;
    } else {
      style.maxWidth = size;
    }
  }
  style.overflow = 'hidden';

  return (
    <div style={style}>
      <div
        className={styles.Container}
        ref={containerRef}
      >
        {childRef.current}
      </div>
    </div>
  );
}

Toggle.propTypes = {
  children: PropTypes.PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  visible: PropTypes.bool,
  duration: PropTypes.number,
  animateEnter: PropTypes.bool,
  from: PropTypes.shape({
    opacity: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
  }),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
};

Toggle.defaultProps = {
  visible: false,
  duration: 300,
  animateEnter: false,
  from: {
    opacity: 0,
    x: 0,
    y: 0,
    z: 0,
  },
  orientation: 'vertical',
};

export default React.memo(Toggle);
