import React from 'react';
import { Outlet, useRoutes } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import RequireGuest from './RequireGuest';

// Pages
const Login = React.lazy(() => import('../pages/Login'));
const Applications = React.lazy(() => import('../pages/Applications'));
const Settings = React.lazy(() => import('../pages/Settings'));

function AppRoutes() {
  const routes = [
    {
      path: '/',
      element: <Outlet />,
      children: [
        {
          index: true,
          element: (
            <RequireGuest>
              <Login />
            </RequireGuest>
          ),
        },
        {
          index: true,
          path: 'login',
          element: (
            <RequireGuest>
              <Login />
            </RequireGuest>
          ),
        },
        {
          path: 'applications',
          element: (
            <RequireAuth>
              <Applications />
            </RequireAuth>
          ),
        },
        {
          path: 'settings',
          element: (
            <RequireAuth>
              <Settings />
            </RequireAuth>
          ),
        },
      ],
    },
  ];

  const element = useRoutes(routes);

  return element;
}

export default React.memo(AppRoutes);
