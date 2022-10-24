import PropTypes from 'prop-types';
import React, {
  useCallback, useEffect, useId, useMemo, useRef, useState,
} from 'react';

import If, { Then, Else } from '../../Electrons/If';
import {
  ownerWindow, debounce, randomIntFromInterval,
} from '../../../services/Tools';
import background from '../../../assets/images/backLogo.png';
import styles from './AnimatedBackground.module.scss';

// TODO useId for ids
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

function AnimatedBackground({
  mask,
}) {
  const componentId = useId();
  const ref = useRef(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const gridColumns = useMemo(() => Array.from({ length: Math.ceil((windowSize?.width || 0) / 256) }, (_v, k) => k), [windowSize?.width]);
  const gridRows = useMemo(() => Array.from({ length: Math.ceil((windowSize?.height || 0) / 256) }, (_v, k) => k), [windowSize?.height]);

  useEffect(() => {
    const handleResize = debounce(() => {
      const container = ref?.current;
      setWindowSize({ width: container?.offsetWidth, height: (container?.offsetHeight || 0) });
    });

    const win = ownerWindow(ref.current);
    win.addEventListener('resize', handleResize);
    handleResize();

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

  return (
    <div ref={ref} className={styles.Base} style={{ clipPath: `url(#svgPath${componentId})` }}>
      <img src={background} alt="Background" />
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        {mask && (
          <defs>
            <clipPath id={`svgPath${componentId}`}>
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
        )}
      </svg>
    </div>
  );
}

AnimatedBackground.propTypes = {
  /**
   * Display mask
   */
  mask: PropTypes.bool,
};

AnimatedBackground.defaultProps = {
  mask: true,
};

export default React.memo(AnimatedBackground);
