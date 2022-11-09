import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { updateAction } from '../../store/header/headerAction';

/**
 * Hook to update store header values
 */
function useHeader() {
  // store
  const dispatch = useDispatch();

  const setHeader = useCallback(
    (icon, title) => {
      dispatch(updateAction({ icon, title }));
    },
    [dispatch],
  );

  return setHeader;
}

export default useHeader;
