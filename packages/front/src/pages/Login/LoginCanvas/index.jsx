import React, {
  useEffect, useRef, useState, useCallback, useMemo,
} from 'react';

import styles from './LoginCanvas.module.scss';

const COLORS = [
  '#5656F3', // blue
  '#F1F18A', // yellow
  '#E7E4D3', // light yellow
  '#84EF8F', // green
  '#DB7777', // red
  '#141720', // black
];
const COLUMNS = 8; // number of columns
const GAP = 0; // gap between shapes
const BG = '#FFFFFF'; // background color

function LoginCanvas() {
  const canvasRef = useRef(null);
  const [context, setContext] = useState();
  const [columnSize, setColumnSize] = useState(1);
  const [ROWS, setROWS] = useState(1);

  // Random between two numbers
  const rand = useCallback((min, max) => Math.floor(Math.random() * (max - min + 1) + min), []);

  // draw arc
  const drawArc = useCallback((x, y, color) => {
    const rayon = Math.max((columnSize - GAP) / 2, 0);
    context.fillStyle = color;
    context.beginPath();
    context.arc(x + rayon, y + rayon, rayon, 0, 2 * Math.PI, false);
    context.fill();

    const isHoled = rand(0, 3);
    if (isHoled === 1) {
      context.fillStyle = BG;
      context.beginPath();
      context.arc(x + rayon, y + rayon, rayon / 3, 0, 2 * Math.PI, false);
      context.fill();
    }
  }, [columnSize, context, rand]);

  // draw square
  const drawSquare = useCallback((x, y, color) => {
    context.fillStyle = color;
    context.fillRect(x, y, columnSize - GAP, columnSize - GAP);

    const isHoled = rand(0, 3);
    if (isHoled === 1) {
      const newSize = (columnSize - GAP) / 3;
      context.fillStyle = BG;
      context.fillRect(x + newSize, y + newSize, newSize, newSize);
    }
  }, [columnSize, context, rand]);

  // draw diamond
  const drawDiamond = useCallback((x, y, color) => {
    context.fillStyle = color;
    // Find center position of the shape
    const cx = x + ((columnSize - GAP) / 2);
    const cy = y + ((columnSize - GAP) / 2);
    // Transform properties
    context.translate(cx, cy); // translate to center of shape
    context.rotate((45 * Math.PI) / 180);
    context.scale(0.71, 0.71);
    context.fillRect(-((columnSize - GAP) / 2), -((columnSize - GAP) / 2), columnSize - GAP, columnSize - GAP);
    const isHoled = rand(0, 2);
    if (isHoled === 1) {
      const newSize = (columnSize - GAP) / 3;
      context.fillStyle = BG;
      context.fillRect(-((newSize) / 2), -((newSize) / 2), newSize, newSize);
    }
    // Reset transform
    context.setTransform(1, 0, 0, 1, 0, 0);
  }, [columnSize, context, rand]);

  // Draw triangle
  const drawTriangle = useCallback((x, y, color) => {
    context.beginPath();
    const rotation = rand(0, 3);
    switch (rotation) {
      case 0: { // Bottom left
        context.moveTo(x, y + columnSize - GAP);
        context.lineTo(x + columnSize - GAP, y + columnSize - GAP);
        context.lineTo(x + columnSize - GAP, y);
        break;
      }
      case 1: { // Top right
        context.moveTo(x, y);
        context.lineTo(x + columnSize - GAP, y + columnSize - GAP);
        context.lineTo(x + columnSize - GAP, y);
        break;
      }
      case 2: { // Top left
        context.moveTo(x + columnSize - GAP, y);
        context.lineTo(x, y);
        context.lineTo(x, y + columnSize - GAP);
        break;
      }
      default: { // Bottom left
        context.moveTo(x, y);
        context.lineTo(x, y + columnSize - GAP);
        context.lineTo(x + columnSize - GAP, y + columnSize - GAP);
        break;
      }
    }
    context.closePath();
    context.fillStyle = color;
    context.fill();
  }, [columnSize, context, rand]);

  const drawRoundedCorner = useCallback((x, y, color) => {
    // Find center position of the shape
    const cx = x + ((columnSize - GAP) / 2);
    const cy = y + ((columnSize - GAP) / 2);
    context.fillStyle = color;
    context.beginPath();
    // Transform properties
    context.translate(cx, cy); // translate to center of shape
    const rotation = rand(0, 3);
    switch (rotation) {
      case 0: { // Bottom left
        context.rotate((-90 * Math.PI) / 180);
        break;
      }
      case 1: { // Top right
        context.rotate((90 * Math.PI) / 180);
        break;
      }
      case 2: { // Top left
        context.rotate((0 * Math.PI) / 180);
        break;
      }
      default: { // Bottom left
        context.rotate((180 * Math.PI) / 180);
        break;
      }
    }
    context.arc(-((columnSize - GAP) / 2), -((columnSize - GAP) / 2), Math.max(columnSize - GAP, 0), 0, Math.PI / 2, false);
    context.lineTo(-((columnSize - GAP) / 2), -((columnSize - GAP) / 2));
    context.fill();
    context.closePath();
    // Reset transform
    context.setTransform(1, 0, 0, 1, 0, 0);
  }, [columnSize, context, rand]);

  const drawRoundedSquare = useCallback((x, y, color) => {
    const rayon = Math.max((columnSize - GAP) / 2, 0);
    // Find center position of the shape
    const cx = x + rayon;
    const cy = y + rayon;
    context.fillStyle = color;
    context.beginPath();
    // Transform properties
    context.translate(cx, cy); // translate to center of shape
    const rotation = rand(0, 3);
    switch (rotation) {
      case 0: { // Bottom left
        context.rotate((-90 * Math.PI) / 180);
        break;
      }
      case 1: { // Top right
        context.rotate((90 * Math.PI) / 180);
        break;
      }
      case 2: { // Top left
        context.rotate((0 * Math.PI) / 180);
        break;
      }
      default: { // Bottom left
        context.rotate((180 * Math.PI) / 180);
        break;
      }
    }
    context.arc(0, 0, rayon, 0, Math.PI, false);
    context.lineTo(-rayon, -rayon);
    context.lineTo(rayon, -rayon);
    context.fill();
    context.closePath();
    // Reset transform
    context.setTransform(1, 0, 0, 1, 0, 0);
  }, [columnSize, context, rand]);

  // All possible shapes
  const shapes = useMemo(() => [
    drawArc, // circle
    drawSquare, // square
    drawTriangle, // triangle
    drawDiamond, // diamond
    drawRoundedCorner, // rounded corner
    drawRoundedSquare, // rounded square
  ], [drawArc, drawSquare, drawDiamond, drawTriangle, drawRoundedCorner, drawRoundedSquare]);

  const draw = useCallback(
    () => {
      const bg = rand(0, 2);
      // const stroke = rand(0, 2);
      // Columns
      Array.from({ length: COLUMNS }, (_, k) => k).forEach((cIndex) => {
        // Rows
        Array.from({ length: ROWS }, (_, k) => k).forEach((rIndex) => {
          // Peak a number between 0 and COLORS length - 1 to peak a random color
          const rColorIndex = rand(0, (COLORS.length - 1));

          // Background
          if (bg === 1) {
            // Draw the shape
            context.fillStyle = `${COLORS[rColorIndex]}33`;
            context.fillRect(cIndex * columnSize + GAP / 2, rIndex * columnSize + GAP / 2, columnSize - GAP, columnSize - GAP);
          }

          context.fillStyle = COLORS[rColorIndex];
          const rShapeIndex = rand(0, (shapes.length - 1));
          shapes?.[rShapeIndex](cIndex * columnSize + GAP / 2, rIndex * columnSize + GAP / 2, COLORS[rColorIndex]);

          // Stroke
          // if (stroke === 1) {
          //   context.rect((cIndex * columnSize) + (GAP / 2), (rIndex * columnSize) + (GAP / 2), columnSize - GAP, columnSize - GAP);
          //   context.stroke();
          // }
        });
      });
    }, [ROWS, columnSize, context, rand, shapes],
  );

  // Runs each time the DOM window resize event fires.
  // Resets the canvas dimensions to match window,
  // then draws the new borders accordingly.
  const resizeCanvas = useCallback(
    () => {
      const canvasWidth = (window.innerWidth / 3) * 2; // the width of the canvas = 2fr / 3 of the window size
      const canvasHeight = window.innerHeight;
      const colSize = canvasWidth / COLUMNS;
      const nbRows = Math.ceil(canvasHeight / colSize);

      // init canvas sizes
      context.canvas.width = canvasWidth;
      context.canvas.height = canvasHeight;
      setColumnSize(colSize);
      setROWS(nbRows);

      // clean canvas
      context.fillStyle = BG;
      context.fillRect(0, 0, canvasWidth, canvasHeight);

      draw();
    }, [context, draw],
  );

  // At the mounted state of the component we initialise the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    setContext(canvas.getContext('2d'));
  }, []);

  // we initialise resize functions
  useEffect(() => {
    if (context) {
      window.addEventListener('resize', resizeCanvas, false);
      resizeCanvas();
    }
    return () => {
      window.removeEventListener('resize', resizeCanvas, false);
    };
  }, [context, resizeCanvas]);

  return (
    <canvas ref={canvasRef} className={styles.Root} />
  );
}

export default React.memo(LoginCanvas);
