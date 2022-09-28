import React from 'react';
import PropTypes from 'prop-types';

import { useAuth } from '../services/Hooks';
import { LoadingLayout, RedirectLayout } from '../components';

function RequireGuest({ children }) {
  const {
    loading,
    loaded,
    hasData,
    location,
    searchParams,
  } = useAuth();

  if (loading) {
    // The application is loading user data
    return (
      <LoadingLayout />
    );
  }

  // If we have some user data loaded,
  // and if we are not on the login page with some searchParams
  // we will be redirect
  if (
    !loading
    && loaded
    && !(['/', '/login'].includes(location?.pathname) && searchParams?.filter(([key]) => key !== 'page')?.length !== 0)
    && hasData
  ) {
    // Redirect them to the /applications page
    return <RedirectLayout path="/applications" />;
  }

  return children;
}

RequireGuest.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default React.memo(RequireGuest);
