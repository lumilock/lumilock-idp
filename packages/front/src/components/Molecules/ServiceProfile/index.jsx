import React from 'react';
import PropTypes from 'prop-types';

import { Squircle, Typography } from '../../Atoms';
import colors from '../../../services/Theme/colors';
import styles from './ServiceProfile.module.scss';

function ServiceProfile({
  image, title, subtitle, titleColor, subtitleColor, loading,
}) {
  console.log(loading);
  return (
    <div className={styles.Root}>
      <Squircle
        size="medium"
        image={image}
      />
      <div className={styles.Title}>
        <Typography variant="h3" color={titleColor}>{title}</Typography>
        <Typography variant="body2" color={subtitleColor}>{subtitle}</Typography>
      </div>
    </div>
  );
}

ServiceProfile.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  titleColor: PropTypes.oneOf(colors),
  subtitleColor: PropTypes.oneOf(colors),
  loading: PropTypes.bool,
};

ServiceProfile.defaultProps = {
  image: undefined,
  title: 'Title',
  subtitle: 'Subtitle',
  titleColor: 'content1',
  subtitleColor: 'content1',
  loading: false,
};

export default React.memo(ServiceProfile);
