import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logoutAction } from '../../store/auth/authAction';
import { authStateSelector } from '../../store/auth/authSelector';

function useLogout() {
  // Router
  const navigate = useNavigate();
  // store
  const { loading, loaded, hasData } = useSelector(authStateSelector);
  const dispatch = useDispatch();

  // function used to logout user by cleaning the store
  const logout = useCallback(
    async () => {
      if (!loading && loaded && hasData) {
        await dispatch(logoutAction(navigate));
      }
    },
    [dispatch, hasData, loaded, loading, navigate],
  );

  return logout;
}

export default useLogout;
