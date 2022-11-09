import React from 'react';

const UsersContext = React.createContext({
  selected: '',
  setSelected: () => {},
  filter: '',
  setFilter: () => {},
});

export default UsersContext;
