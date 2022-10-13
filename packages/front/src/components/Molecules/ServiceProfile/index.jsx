import React from 'react';
import PropTypes from 'prop-types';

import {
  Else, If, Skeleton, Squircle, Then, Typography,
} from '../../Atoms';
import colors from '../../../services/Theme/colors';
import styles from './ServiceProfile.module.scss';
import { remCalc } from '../../../services/Tools';

function ServiceProfile({
  image, title, subtitle, titleColor, subtitleColor, loading,
}) {
  return (
    <div className={styles.Root}>
      <Squircle
        size="medium"
        image={image}
        loading={loading}
        animation="wave"
      />
      <div className={styles.Title}>
        <If condition={loading}>
          <Then>
            <Skeleton width="64px" height={remCalc(20)} animation="wave" />
            <Skeleton width="128px" height={remCalc(15)} animation="wave" />
          </Then>
          <Else>
            <Typography variant="h3" color={titleColor}>{title}</Typography>
            <Typography variant="body2" color={subtitleColor}>{subtitle}</Typography>
          </Else>
        </If>
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
