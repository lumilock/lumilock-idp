import React from 'react';
import PropTypes from 'prop-types';

import styles from './Divider.module.scss';
import { pascalCase } from '../../../services/Tools';

function Divider({ className, color }) {
  return (
    <hr className={[styles.Base, className, styles[pascalCase(color)]].join(' ').trim()} />
  );
}

Divider.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf(['background1', 'background2', 'background3', 'main', 'content1', 'content2', 'content3']),
};

Divider.defaultProps = {
  className: '',
  color: 'background2',
};

export default React.memo(Divider);
