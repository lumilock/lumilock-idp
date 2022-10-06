import React from 'react';
import PropTypes from 'prop-types';

import { useEffectOnce, useHeader } from '../../../services/Hooks';

function HeaderWrapper({ icon, title, children }) {
  const setHeader = useHeader();

  useEffectOnce(() => {
    setHeader(icon, title);
  }, []);

  return children;
}

HeaderWrapper.propTypes = {
  icon: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

HeaderWrapper.defaultProps = {
  icon: undefined,
  title: undefined,
  children: undefined,
};

export default React.memo(HeaderWrapper);
