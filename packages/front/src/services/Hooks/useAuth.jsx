import { useDispatch, useSelector } from 'react-redux';

import { updateAction } from '../../store/auth/authAction';
import { authStateSelector, authInfoSelector } from '../../store/auth/authSelector';

function useAuth() {
  // store
  const { loading, loaded, hasData } = useSelector(authStateSelector);
  const user = useSelector(authInfoSelector);
  const dispatch = useDispatch();

  if (!loading && !loaded) {
    console.log('here');
    dispatch(updateAction());
  }

  return {
    loading,
    loaded,
    hasData,
    user,
  };
}

export default useAuth;
