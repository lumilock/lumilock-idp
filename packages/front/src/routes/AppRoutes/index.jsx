import React from 'react';
import { Outlet, useRoutes } from 'react-router-dom';

// Pages
import {
  Login,
} from '../../pages';

function AppRoutes() {
  const routes = [
    {
      path: '/',
      element: <Outlet />,
      children: [
        { index: true, element: <Login /> },
        {
          path: 'login',
          element: <Login />,
        },
      ],
    },
  ];

  const element = useRoutes(routes);

  return element;
}

export default React.memo(AppRoutes);
