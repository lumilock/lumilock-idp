import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
} from 'react-router-dom';

import { LoadingLayout } from './components';
import AppRoutes from './routes';
import './App.css';

const Main = React.lazy(() => import('./components/Species/Main'));
const FetchInterceptor = React.lazy(() => import('./components/Electrons/FetchInterceptor'));

function App() {
  return (
    <main className="App">
      <Router>
        <Suspense fallback={<LoadingLayout message="Initialisation..." color="content1" />}>
          <FetchInterceptor>
            <Suspense fallback={<LoadingLayout message="Connection..." color="content1" />}>
              <Main>
                <Suspense fallback={<LoadingLayout message="Chargement..." color="content1" />}>
                  <AppRoutes />
                </Suspense>
              </Main>
            </Suspense>
          </FetchInterceptor>
        </Suspense>
      </Router>
    </main>
  );
}

export default React.memo(App);
