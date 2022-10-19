import React from 'react';

const UsersContext = React.createContext({
  selected: '',
  setSelected: () => {},
});

export default UsersContext;
