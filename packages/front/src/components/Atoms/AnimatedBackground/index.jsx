import PropTypes from 'prop-types';
import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';

import { ownerWindow, debounce, randomIntFromInterval } from '../../../services/Tools';
import { useEffectOnce } from '../../../services/Hooks';
import styles from './AnimatedBackground.module.scss';

function AnimatedBackground({ ballsNumber, minSize, maxSize }) {
  const ref = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [interval, setInterval] = useState(null);
  const ballsArray = useMemo(() => Array.from({ length: ballsNumber }, (_v, k) => k), [ballsNumber]);

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
      setInterval(id);
    },
    [ballsNumber, maxSize, minSize, move, setNewPositions],
  );

  useEffect(() => {
    const handleResize = debounce(() => {
      const container = ref?.current;
      setWindowSize({ width: container?.offsetWidth, height: (container?.offsetWidth || 0) / 4 });
    });

    const win = ownerWindow(ref.current);
    win.addEventListener('resize', handleResize);

    return () => {
      handleResize.clear();
      win.removeEventListener('resize', handleResize);
    };
  }, []);

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
    setInterval(null);
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
            <path d="M0,128C0,0,0,0,128,0S256,0,256,128s0,128-128,128S0,256,0,128" />
            <path d="M0,128C0,0,0,0,128,0S256,0,256,128s0,128-128,128S0,256,0,128" transform="translate(256 256)" />
            <path d="M0,64C0,0,0,0,64,0s64,0,64,64,0,64-64,64S0,128,0,64" transform="translate(256)" />
            <path d="M0,64C0,0,0,0,64,0s64,0,64,64,0,64-64,64S0,128,0,64" transform="translate(256 128)" />
            <path d="M0,64C0,0,0,0,64,0s64,0,64,64,0,64-64,64S0,128,0,64" transform="translate(384 128)" />
            <path d="M0,64C0,0,0,0,64,0s64,0,64,64,0,64-64,64S0,128,0,64" transform="translate(384)" />
            <path d="M0,64C0,0,0,0,64,0s64,0,64,64,0,64-64,64S0,128,0,64" transform="translate(0 256)" />
            <path d="M0,64C0,0,0,0,64,0s64,0,64,64,0,64-64,64S0,128,0,64" transform="translate(0 384)" />
            <path d="M0,64C0,0,0,0,64,0s64,0,64,64,0,64-64,64S0,128,0,64" transform="translate(128 384)" />
            <path d="M0,64C0,0,0,0,64,0s64,0,64,64,0,64-64,64S0,128,0,64" transform="translate(128 256)" />
          </clipPath>
        </defs>
        {/* <defs>
          <pattern id="star" viewBox="0,0,10,10" width="10%" height="10%">
            <polygon points="0,0 2,5 0,10 5,8 10,10 8,5 10,0 5,2" />
          </pattern>
        </defs>
        <rect fill="url(#star)" x="0" y="0" stroke="#000000" width={windowSize?.width} height={windowSize?.height} />
        <clipPath id="theSVGPath">
          <rect x="0" y="0" stroke="#000000" width="500" height="500" />
        </clipPath> */}
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
