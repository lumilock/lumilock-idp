import React from 'react';
import PropTypes from 'prop-types';

import ServiceProfile from '../../Molecules/ServiceProfile';
import styles from './ServiceButton.module.scss';

function ServiceButton({
  image, name, id, selected, setSelected,
}) {
  const handleClick = () => {
    setSelected((old) => (old === id ? '' : id));
  };

  return (
    <div
      className={[
        styles.Root,
        selected ? styles.Active : '',
      ].join(' ').replace('  ', ' ').trim()}
      onClick={handleClick}
      onKeyDown={handleClick}
      role="button"
      tabIndex={0}
    >
      <ServiceProfile
        image={image}
        title={name}
        subtitle={id}
        titleColor={!selected ? 'content1' : 'background1'}
        subtitleColor={!selected ? 'content3' : 'background3'}
      />
    </div>
  );
}

ServiceButton.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string,
  name: PropTypes.string,
  selected: PropTypes.bool,
  setSelected: PropTypes.func,
};

ServiceButton.defaultProps = {
  image: undefined,
  name: 'App name',
  selected: false,
  setSelected: () => {},
};

export default React.memo(ServiceButton);
