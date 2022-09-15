import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';

import AppRoutes from './routes';

import './App.css';

function App() {
  return (
    <main className="App">
      <Router>
        <Suspense fallback={<span>Loading...</span>}>
          <AppRoutes />
        </Suspense>
      </Router>
    </main>
  );
}

export default React.memo(App);
