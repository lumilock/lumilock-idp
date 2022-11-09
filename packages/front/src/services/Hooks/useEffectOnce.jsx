import { useEffect } from 'react';

// Custom hooks useEffectOnce
// run only once and will emulate the componentDidMount of
// React class based components.
export default function useEffectOnce(cb) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(cb, []);
}
