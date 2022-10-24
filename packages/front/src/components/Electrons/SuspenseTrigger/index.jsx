import React from 'react';
import PropTypes from 'prop-types';

function SuspenseTrigger({ loading }) {
  if (loading) {
    // eslint-disable-next-line no-promise-executor-return
    throw new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return [];
}

SuspenseTrigger.propTypes = {
  loading: PropTypes.bool,
};

SuspenseTrigger.defaultProps = {
  loading: true,
};

export default React.memo(SuspenseTrigger);
