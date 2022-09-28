import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../services/Hooks';
import { LoadingLayout, RedirectLayout } from '../components';

function RequireAuth({ children }) {
  const {
    loading,
    loaded,
    hasData,
    // user,
  } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    // The application is loading user data
    return (
      <LoadingLayout />
    );
  }

  if (!loading && loaded && !hasData) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    navigate('/');
    return <RedirectLayout />;
  }

  return children;
}

RequireAuth.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default React.memo(RequireAuth);
