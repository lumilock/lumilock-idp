import React from 'react';
import PropTypes from 'prop-types';

import { useAuth } from '../../../services/Hooks';
import { Header, Navbar } from '../../Organisms';

import styles from './Main.module.scss';

const SuspenseTrigger = React.lazy(() => import('../../Atoms/SuspenseTrigger'));

function Main({ children }) {
  // Checking Auth connection
  const {
    loading,
    loaded,
    hasData,
  } = useAuth();

  // While loading we trigger the suspense parent component
  if (loading) {
    return <SuspenseTrigger loading />;
  }

  // if user is not authenticated,
  // we just return children
  // without template
  if (!loading && loaded && !hasData) {
    return children;
  }

  // If the user is authenticated
  // we return the children inside the template
  return (
    <div className={styles.Root}>
      <Navbar />
      <div className={styles.Body}>
        <Header />
        {children}
      </div>
    </div>
  );
}

Main.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default React.memo(Main);
