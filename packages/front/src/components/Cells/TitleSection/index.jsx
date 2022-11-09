import React from 'react';
import PropTypes from 'prop-types';

import { capitalize } from 'lodash';
import { Title } from '../../Molecules';
import styles from './TitleSection.module.scss';

function TitleSection({
  variant, icon, title, color, borderColor,
}) {
  return (
    <div className={[
      styles.Root,
      styles?.[capitalize(variant)] || '',
      styles?.[capitalize(borderColor)] || '',
    ].join(' ').trim()}
    >
      <Title icon={icon} title={title} color={color} />
    </div>
  );
}

TitleSection.propTypes = {
  variant: PropTypes.oneOf([
    'standard',
    'gradient',
    'underlined',
  ]),
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
  borderColor: PropTypes.oneOf([
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
  variant: 'standard',
  borderColor: 'background3',
  color: undefined,
  icon: undefined,
  title: undefined,
};

export default React.memo(TitleSection);
