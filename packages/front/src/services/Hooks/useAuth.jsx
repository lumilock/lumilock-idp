import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';

import { updateAction } from '../../store/auth/authAction';
import { authStateSelector, authInfoSelector } from '../../store/auth/authSelector';
import { getAllQuery } from '../Tools';

function useAuth() {
  // store
  const { loading, loaded, hasData } = useSelector(authStateSelector);
  const user = useSelector(authInfoSelector);
  const dispatch = useDispatch();

  // Router
  const [searchParams] = useSearchParams();
  const location = useLocation();

  if (!loading && !loaded) {
    dispatch(updateAction());
  }

  return {
    loading,
    loaded,
    hasData,
    user,
    location,
    searchParams: getAllQuery(searchParams),
  };
}

export default useAuth;
