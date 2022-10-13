import React from 'react';

const ServicesContext = React.createContext({
  selected: '',
  setSelected: () => {},
});

export default ServicesContext;
