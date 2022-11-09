import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

import { authReducer } from './auth/authReducer';
import { headerReducer } from './header/headerReducer';

const store = createStore(
  combineReducers({
    auth: authReducer,
    header: headerReducer,
  }),
  composeWithDevTools(
    applyMiddleware(thunk),
  ),
);

export default store;
