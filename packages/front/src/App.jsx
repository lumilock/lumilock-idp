import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';

import AppRoutes from './routes';
import './App.css';

const Main = React.lazy(() => import('./components/Species/Main'));

function App() {
  return (
    <main className="App">
      <Router>
        <Suspense fallback={<span>Connection...</span>}>
          <Main>
            <Suspense fallback={<span>Loading...</span>}>
              <AppRoutes />
            </Suspense>
          </Main>
        </Suspense>
      </Router>
    </main>
  );
}

export default React.memo(App);
