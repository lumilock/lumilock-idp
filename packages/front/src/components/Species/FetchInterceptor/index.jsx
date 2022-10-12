import React from 'react';
import { useLogout } from '../../../services/Hooks';

const { fetch: originalFetch } = window;

function Test({ children }) {
  // Store
  const logout = useLogout();

  // Fetch error interceptor used to automaticaly logout the user when
  // he receive a 401 unauthorized error
  window.fetch = async (...args) => {
    const [resource, config] = args;
    const response = await originalFetch(resource, config);
    if (!response.ok && response.status === 404) {
      // 404 error handling
      return Promise.reject(response);
    } if (!response.ok && response.status === 401) {
      logout();
      return Promise.reject(response);
    }
    return response;
  };
  return [children];
}

export default React.memo(Test);
