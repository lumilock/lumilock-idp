import React from 'react';
import PropTypes from 'prop-types';

import { Squircle, Typography } from '../../Atoms';
import styles from './ServiceButton.module.scss';

function ServiceButton({ image, name, id }) {
  const handleClick = () => {
    console.log('click');
  };

  return (
    <div
      className={styles.Root}
      onClick={handleClick}
      onKeyDown={handleClick}
      role="button"
      tabIndex={0}
    >
      <Squircle
        size="medium"
        image={image}
      />
      <div className={styles.Title}>
        <Typography variant="h3">{name}</Typography>
        <Typography variant="body2">{id}</Typography>
      </div>
    </div>
  );
}

ServiceButton.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string,
  name: PropTypes.string,
};

ServiceButton.defaultProps = {
  image: undefined,
  name: 'App name',
};

export default React.memo(ServiceButton);
