import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';

import { LoadingLayout, SuspenseTrigger } from './components';
import AppRoutes from './routes';
import './App.css';

const Main = React.lazy(() => import('./components/Species/Main'));
const FetchInterceptor = React.lazy(() => import('./components/Electrons/FetchInterceptor'));

function App() {
  return (
    <main className="App">
      <Router>
        <Suspense fallback={<LoadingLayout message="Initialisation..." />}>
          <SuspenseTrigger>
            <FetchInterceptor>
              <Suspense fallback={<LoadingLayout message="Connection..." />}>
                <Main>
                  <Suspense fallback={<LoadingLayout message="Chargement..." />}>
                    <AppRoutes />
                  </Suspense>
                </Main>
              </Suspense>
            </FetchInterceptor>
          </SuspenseTrigger>
        </Suspense>
      </Router>
    </main>
  );
}

export default React.memo(App);
