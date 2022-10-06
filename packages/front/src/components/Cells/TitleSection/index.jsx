import React from 'react';
import PropTypes from 'prop-types';

import { Title } from '../../Molecules';
import styles from './TitleSection.module.scss';

function TitleSection({ icon, title, color }) {
  return (
    <div className={styles.Root}>
      <Title icon={icon} title={title} color={color} />
    </div>
  );
}

TitleSection.propTypes = {
  /**
   * text color variations
   */
  color: PropTypes.oneOf([
    'alert',
    'alert dark',
    'info',
    'standard',
    'main',
    'content1',
    'content2',
    'content3',
    'background1',
    'background2',
    'background3',
  ]),
  icon: PropTypes.func,
  title: PropTypes.string,
};

TitleSection.defaultProps = {
  color: '',
  icon: undefined,
  title: '',
};

export default React.memo(TitleSection);
