import React from 'react';
import PropTypes from 'prop-types';

import generateUUID from '../../services/Tools/generateUUID';

import noAppImage from '../../assets/images/noAppImage.png';
import styles from './Squircle.module.scss';

function Squircle({ image, className, size }) {
  const uuid = generateUUID();

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${styles.Root} ${styles[size]} ${className ? ` ${className}` : ''}`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="white"
    >
      {/* clipPath with a squircle shape */}
      <defs>
        <clipPath id={`ClipPath-${uuid}`}>
          <path id="squircle" d="M 0, 50 C 0, 0 0, 0 50, 0 S 100, 0 100, 50 100, 100 50, 100 0, 100 0, 50" />
        </clipPath>
      </defs>
      {/* Image element that will be clipped */}
      <defs>
        <pattern id={`Image-${uuid}`} patternUnits="userSpaceOnUse" width="100" height="100">
          <image
            xlinkHref={image || noAppImage}
            x="0"
            y="0"
            height="100"
            width="100"
            preserveAspectRatio="xMidYMin slice"
          />
        </pattern>
      </defs>
      {/* All element Clipped by squircle clipPath */}
      <g clipPath={`url(#ClipPath-${uuid})`} height="100" width="100" stroke="#00000040">
        {/* default background with a squircle shape in order to have white background and grey stroke */}
        <path d="M 0, 50 C 0, 0 0, 0 50, 0 S 100, 0 100, 50 100, 100 50, 100 0, 100 0, 50" height="100" width="100" fill={`url(#Image-${uuid})`} />
      </g>
    </svg>
  );
}

Squircle.propTypes = {
  image: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(['XS', 'S', 'M', 'ML', 'L', 'XL', 'XXL', 'XXXL']),
};

Squircle.defaultProps = {
  image: '',
  className: '',
  size: 'L',
};

export default React.memo(Squircle);
