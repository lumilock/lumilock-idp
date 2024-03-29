import React, { useId, useMemo } from 'react';
import PropTypes from 'prop-types';
import { IoIosConstruct } from 'react-icons/io';

import { capitalize, pascalCase } from '../../../services/Tools';
import { loadingAnimations, sizes } from '../../../services/Theme';
import Icon from '../../Electrons/Icon';
import Choose, { OtherWise, When } from '../../Electrons/Choose';
import styles from './Squircle.module.scss';
import If from '../../Electrons/If';

function Squircle({
  image, variant, className, size, icon, loading, animation,
}) {
  const id = useId();

  const imageFilter = useMemo(() => {
    if (loading) {
      return `url(#LoadingImage${id})`;
    } if (!!image && variant === 'standard') {
      return `url(#Image${id})`;
    } if (!image && variant === 'dashed') {
      return `url(#DashedImage${id})`;
    }
    return `url(#DefaultImage${id})`;
  }, [id, image, loading, variant]);

  return (
    <svg
      viewBox="0 0 100 100"
      className={[
        styles.Root,
        styles?.[sizes?.[size]] || '',
        styles?.[capitalize(variant)] || '',
        loading ? styles.Loading : '',
        loading && !!animation ? styles?.[pascalCase(animation)] : '',
        className,
      ].join(' ').replaceAll('  ', ' ').trim()}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fill="white"
    >
      {/* clipPath with a squircle shape */}
      <defs>
        <clipPath id={`ClipPath${id}`}>
          <path id="squircle" d="M 0, 50 C 0, 0 0, 0 50, 0 S 100, 0 100, 50 100, 100 50, 100 0, 100 0, 50" />
        </clipPath>
      </defs>
      {/* Image element that will be clipped */}
      <defs>
        <Choose>
          <When condition={!!loading}>
            {/* Loading */}
            <>
              <pattern
                id={`LoadingImage${id}`}
                className={styles.LoadingImage}
                patternUnits="userSpaceOnUse"
                width="100"
                height="100"
              >
                <path
                  d="M 0, 50 C 0, 0 0, 0 50, 0 S 100, 0 100, 50 100, 100 50, 100 0, 100 0, 50"
                  height="100"
                  width="100"
                />
              </pattern>
              <linearGradient id="MyGradient">
                <stop offset="0%" stopColor="#f6f8ff00" />
                <stop offset="50%" stopColor="#f6f8ff" />
                <stop offset="100%" stopColor="#f6f8ff00" />
              </linearGradient>
            </>
          </When>
          <When condition={!!image && variant === 'standard'}>
            {/* Image */}
            <pattern id={`Image${id}`} className={styles.Image} patternUnits="userSpaceOnUse" width="100" height="100">
              <path
                d="M 0, 50 C 0, 0 0, 0 50, 0 S 100, 0 100, 50 100, 100 50, 100 0, 100 0, 50"
                height="100"
                width="100"
              />
              <image
                xlinkHref={image}
                x="0"
                y="0"
                height="100"
                width="100"
                preserveAspectRatio="xMidYMin slice"
              />
            </pattern>
          </When>
          <When condition={variant === 'dashed'}>
            <pattern id={`DashedImage${id}`} className={styles.DashedImage} patternUnits="userSpaceOnUse" width="100" height="100">
              <path
                d="M 0, 50 C 0, 0 0, 0 50, 0 S 100, 0 100, 50 100, 100 50, 100 0, 100 0, 50"
                height="100"
                width="100"
              />
              <If condition={!!icon}>
                <Icon ionIcon={icon} x="25" y="25" size="50" color="content3" />
              </If>
            </pattern>
          </When>
          <OtherWise>
            {/* Default Image */}
            <pattern id={`DefaultImage${id}`} className={styles.DefaultImage} patternUnits="userSpaceOnUse" width="100" height="100">
              <path
                d="M 0, 50 C 0, 0 0, 0 50, 0 S 100, 0 100, 50 100, 100 50, 100 0, 100 0, 50"
                height="100"
                width="100"
                stroke="#00000040"
              />
              {/* background */}
              <rect x="0" y="0" width="100" height="100" />
              {/* X */}
              <line x1="0" y1="0" x2="100" y2="100" />
              <line x1="0" y1="100" x2="100" y2="0" />
              {/* Verticals */}
              <line x1="25" y1="0" x2="25" y2="100" />
              <line x1="50" y1="0" x2="50" y2="100" />
              <line x1="75" y1="0" x2="75" y2="100" />
              {/* Horizontals */}
              <line x1="0" y1="25" x2="100" y2="25" />
              <line x1="0" y1="50" x2="100" y2="50" />
              <line x1="0" y1="75" x2="100" y2="75" />
              <Icon ionIcon={IoIosConstruct} x="25" y="25" size="50" color="background1" />
            </pattern>
          </OtherWise>
        </Choose>
      </defs>
      {/* All element Clipped by squircle clipPath */}
      <g
        clipPath={`url(#ClipPath${id})`}
        height="100"
        width="100"
      >
        {/* default background with a squircle shape in order to have white background and grey stroke */}
        <path
          d="M 0, 50 C 0, 0 0, 0 50, 0 S 100, 0 100, 50 100, 100 50, 100 0, 100 0, 50"
          height="100"
          width="100"
          fill={imageFilter}
        />
        <If condition={loading && animation === 'wave'}>
          <rect x="0" y="0" width="100" height="100" className={styles.Gradiant} fill="url(#MyGradient)" />
        </If>
      </g>
    </svg>
  );
}

Squircle.propTypes = {
  image: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.func,
  size: PropTypes.oneOf(sizes),
  variant: PropTypes.oneOf(['standard', 'dashed']),
  animation: PropTypes.oneOf(loadingAnimations),
  loading: PropTypes.bool,
};

Squircle.defaultProps = {
  image: '',
  className: '',
  icon: undefined,
  size: 'large',
  variant: 'standard',
  animation: 'pulse',
  loading: false,
};

export default React.memo(Squircle);
