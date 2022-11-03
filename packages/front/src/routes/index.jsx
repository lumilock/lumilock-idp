import React from 'react';
import { Outlet, useRoutes } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import RequireGuest from './RequireGuest';

// Pages
const Login = React.lazy(() => import('../pages/Login'));
const Profile = React.lazy(() => import('../pages/Profile'));
const Applications = React.lazy(() => import('../pages/Applications'));
const Services = React.lazy(() => import('../pages/Services'));
const ServicesAdd = React.lazy(() => import('../pages/Services/Nested/Add'));
const ServicesUpdate = React.lazy(() => import('../pages/Services/Nested/Update'));
const Users = React.lazy(() => import('../pages/Users'));
const UsersAdd = React.lazy(() => import('../pages/Users/Nested/Add'));
const Keys = React.lazy(() => import('../pages/Keys'));
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
          path: 'profile',
          element: (
            <RequireAuth>
              <Profile />
            </RequireAuth>
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
          path: 'services',
          element: (
            <RequireAuth>
              <Outlet />
            </RequireAuth>
          ),
          children: [
            {
              index: true,
              path: '',
              element: (
                <Services />
              ),
            },
            {
              path: 'add',
              element: (
                <ServicesAdd />
              ),
            },
            {
              path: ':serviceId',
              element: (
                <ServicesUpdate />
              ),
            },
          ],
        },
        {
          path: 'users',
          element: (
            <RequireAuth>
              <Outlet />
            </RequireAuth>
          ),
          children: [
            {
              index: true,
              path: '',
              element: (
                <Users />
              ),
            },
            {
              path: 'add',
              element: (
                <UsersAdd />
              ),
            },
          ],
        },
        {
          path: 'keys',
          element: (
            <RequireAuth>
              <Keys />
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
