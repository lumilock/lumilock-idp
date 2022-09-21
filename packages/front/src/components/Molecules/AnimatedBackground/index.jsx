import PropTypes from 'prop-types';
import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';

import If, { Then, Else } from '../../Atoms/If';
import { ownerWindow, debounce, randomIntFromInterval } from '../../../services/Tools';
import { useEffectOnce } from '../../../services/Hooks';
import styles from './AnimatedBackground.module.scss';

function TileMask({
  columnIndex, rowIndex, rowLength, winHeight,
}) {
  const isSmall = randomIntFromInterval(0, 1);
  // calculate mask tiles positions
  const transform = useCallback(
    (x, y, scale = 2) => `translate(${256 * x}, ${(256 * y) - (((rowLength * 256) - winHeight) / 2)}) scale(${scale})`,
    [rowLength, winHeight],
  );

  return (
    <If condition={!!isSmall}>
      <Then>
        <path d="M0,64C0,0,0,0,64,0S128,0,128,64s0,64-64,64S0,128,0,64" transform={transform(columnIndex, rowIndex, 1)} />
        <path d="M0,64C0,0,0,0,64,0S128,0,128,64s0,64-64,64S0,128,0,64" transform={transform(columnIndex + 0.5, rowIndex, 1)} />
        <path d="M0,64C0,0,0,0,64,0S128,0,128,64s0,64-64,64S0,128,0,64" transform={transform(columnIndex, rowIndex + 0.5, 1)} />
        <path d="M0,64C0,0,0,0,64,0S128,0,128,64s0,64-64,64S0,128,0,64" transform={transform(columnIndex + 0.5, rowIndex + 0.5, 1)} />
      </Then>
      <Else>
        <path d="M0,64C0,0,0,0,64,0S128,0,128,64s0,64-64,64S0,128,0,64" transform={transform(columnIndex, rowIndex)} />
      </Else>
    </If>
  );
}

TileMask.propTypes = {
  columnIndex: PropTypes.number,
  rowIndex: PropTypes.number,
  rowLength: PropTypes.number,
  winHeight: PropTypes.number,
};

TileMask.defaultProps = {
  columnIndex: 0,
  rowIndex: 0,
  rowLength: 0,
  winHeight: 0,
};

function AnimatedBackground({ ballsNumber, minSize, maxSize }) {
  const ref = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [interval, setIntrvl] = useState(null);
  const ballsArray = useMemo(() => Array.from({ length: ballsNumber }, (_v, k) => k), [ballsNumber]);
  const gridColumns = useMemo(() => Array.from({ length: Math.ceil((windowSize?.width || 0) / 256) }, (_v, k) => k), [windowSize?.width]);
  const gridRows = useMemo(() => Array.from({ length: Math.ceil((windowSize?.height || 0) / 256) }, (_v, k) => k), [windowSize?.height]);

  const move = useCallback(
    (el, x, y, size) => {
      // eslint-disable-next-line no-param-reassign
      el.style.top = `${x}px`;
      // eslint-disable-next-line no-param-reassign
      el.style.left = `${y}px`;
      // eslint-disable-next-line no-param-reassign
      el.style.width = `${size}rem`;
      // eslint-disable-next-line no-param-reassign
      el.style.height = `${size}rem`;
      // eslint-disable-next-line no-param-reassign
      el.style.transition = '5s ease-in-out';
    },
    [],
  );

  const setNewPositions = useCallback(() => {
    // Define elements
    const container = ref?.current;
    const group1 = container?.getElementsByClassName('group1')[0];
    const circleG1 = group1?.getElementsByClassName('circle');
    const group2 = container?.getElementsByClassName('group2')[0];
    const circleG2 = group2?.getElementsByClassName('circle');
    const group3 = container?.getElementsByClassName('group3')[0];
    const circleG3 = group3?.getElementsByClassName('circle');

    const index = randomIntFromInterval(0, ballsNumber - 1);

    const circle1 = circleG1[index];
    const circle2 = circleG2[index];
    const circle3 = circleG3[index];

    const width = container?.offsetWidth;
    const height = container?.offsetHeight;
    const size = randomIntFromInterval(minSize, maxSize);
    const y = randomIntFromInterval(size - 0, (windowSize?.width || width));
    const x = randomIntFromInterval(size - 0, (windowSize?.height || height));
    move(circle1, x, y, size);
    move(circle2, x, y, size);
    move(circle3, x, y, size);
  }, [ballsNumber, maxSize, minSize, move, windowSize?.height, windowSize?.width]);

  const init = useCallback(
    () => {
      // Define elements
      const container = ref?.current;
      const group1 = container?.getElementsByClassName('group1')[0];
      const circleG1 = group1?.getElementsByClassName('circle');
      const group2 = container?.getElementsByClassName('group2')[0];
      const circleG2 = group2?.getElementsByClassName('circle');
      const group3 = container?.getElementsByClassName('group3')[0];
      const circleG3 = group3?.getElementsByClassName('circle');
      // Calculate container size
      const width = container?.offsetWidth;
      const height = container?.offsetHeight;
      setWindowSize({ width, height });
      // initialise circles
      for (let index = 0; index < ballsNumber; index += 1) {
        const circle1 = circleG1[index];
        const circle2 = circleG2[index];
        const circle3 = circleG3[index];
        const size = randomIntFromInterval(minSize, maxSize);
        const y = randomIntFromInterval(size - 0, width);
        const x = randomIntFromInterval(size - 0, height);
        move(circle1, x, y, size);
        move(circle2, x, y, size);
        move(circle3, x, y, size);
      }

      const id = window.setInterval(() => {
        setNewPositions();
      }, 5000 / 5);
      setIntrvl(id);
    },
    [ballsNumber, maxSize, minSize, move, setNewPositions],
  );

  useEffect(() => {
    const handleResize = debounce(() => {
      const container = ref?.current;
      setWindowSize({ width: container?.offsetWidth, height: (container?.offsetHeight || 0) });
    });

    const win = ownerWindow(ref.current);
    win.addEventListener('resize', handleResize);

    return () => {
      handleResize.clear();
      win.removeEventListener('resize', handleResize);
    };
  }, []);

  // calculate mask tiles positions
  const tileKey = useCallback(
    (x, y) => `${x}-${y}`,
    [],
  );

  useEffectOnce(() => {
    init();
  });

  useEffect(() => {
    if (!interval) {
      const id = window.setInterval(() => {
        setNewPositions();
      }, 5000 / 5);

      return () => {
        window.clearInterval(id);
      };
    }
    return () => {};
  }, [interval, setNewPositions]);

  useEffect(() => () => {
    window.clearInterval(interval);
    setIntrvl(null);
  }, [interval, setNewPositions]);

  return (
    <div ref={ref} className={styles.Base}>
      <div className={`${styles.Group} group1`}>
        {ballsArray.map((k) => (
          <span key={k} className={`${styles.Circle} circle`} />
        ))}
      </div>
      <div className={`${styles.Group} group2`}>
        {ballsArray.map((k) => (
          <span key={k} className={`${styles.Circle} circle`} />
        ))}
      </div>
      <div className={`${styles.Group} group3`}>
        {ballsArray.map((k) => (
          <span key={k} className={`${styles.Circle} circle`} />
        ))}
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <clipPath id="svgPath">
            {gridColumns?.map((cI) => (
              <React.Fragment key={cI}>
                {gridRows?.map((rI) => (
                  <TileMask
                    key={tileKey(cI, rI)}
                    columnIndex={cI}
                    rowIndex={rI}
                    rowLength={gridRows?.length || 0}
                    winHeight={windowSize?.height || 0}
                  />
                ))}
              </React.Fragment>
            ))}
          </clipPath>
        </defs>
        <defs>
          <filter id="fancyGoo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
          <filter id="blurFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="100" />
          </filter>
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="100"
              result="noise"
              stitchTiles="stitch"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="200" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

AnimatedBackground.propTypes = {
  /**
   * Number of balls to generate
   */
  ballsNumber: PropTypes.number,
  /**
   * Min ball size in rem (1rem = 16px)
   */
  minSize: PropTypes.number,
  /**
   * Max ball size in rem (1rem = 16px)
   */
  maxSize: PropTypes.number,
};

AnimatedBackground.defaultProps = {
  ballsNumber: 4,
  minSize: 50 / 16,
  maxSize: 500 / 16,
};

export default React.memo(AnimatedBackground);
