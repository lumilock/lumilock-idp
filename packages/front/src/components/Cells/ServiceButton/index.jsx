import React from 'react';
import PropTypes from 'prop-types';

import ServiceProfile from '../../Molecules/ServiceProfile';
import styles from './ServiceButton.module.scss';

function ServiceButton({
  image, name, id, selected, setSelected, disabled, loading,
}) {
  const handleClick = () => {
    setSelected((old) => (old === id ? '' : id));
  };

  return (
    <div
      className={[
        styles.Root,
        selected ? styles.Active : '',
        loading ? styles.Loading : '',
      ].join(' ').replace('  ', ' ').trim()}
      onClick={handleClick}
      onKeyDown={handleClick}
      role="button"
      tabIndex={0}
      disabled={disabled ? 'disabled' : ''}
    >
      <ServiceProfile
        image={image}
        title={name}
        subtitle={id}
        titleColor={!selected ? 'content1' : 'background1'}
        subtitleColor={!selected ? 'content3' : 'background3'}
        loading={loading}
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
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

ServiceButton.defaultProps = {
  image: undefined,
  name: 'App name',
  selected: false,
  setSelected: () => {},
  disabled: false,
  loading: false,
};

export default React.memo(ServiceButton);
