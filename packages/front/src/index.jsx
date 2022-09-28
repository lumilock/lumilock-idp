import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import * as process from 'process';

import App from './App';
import store from './store';
// import reportWebVitals from './reportWebVitals';

import './assets/styles/fonts.scss';
import './assets/styles/stylesheet.scss';

if (typeof process !== 'undefined' && process?.env?.NODE_ENV === 'development') {
  window.process = process;
}

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App tab="home" />
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
