import React from 'react';

const ServicesContext = React.createContext({
  selected: '',
  setSelected: () => {},
  filter: '',
  setFilter: () => {},
});

export default ServicesContext;
