import { useEffect, useRef } from 'react';

export default function useUpdate(callback, dependencies) {
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    // eslint-disable-next-line consistent-return
    return callback();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
