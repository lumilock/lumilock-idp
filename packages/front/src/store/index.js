import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

import { authReducer } from './auth/authReducer';

const store = createStore(
  combineReducers({
    auth: authReducer,
  }),
  composeWithDevTools(
    applyMiddleware(thunk),
  ),
);

export default store;
