// services/Hooks/useWasm.jsx

import { useState } from 'react';
import { AsBind } from 'as-bind';
import useEffectOnce from './useEffectOnce';

export default function useWasm() {
  const [state, setState] = useState(null);

  useEffectOnce(() => {
    const fetchWasm = async () => {
      const wasm = await fetch('myModule.release.wasm');
      const instance = await AsBind.instantiate(wasm, {});
      setState(instance);
    };
    fetchWasm();
  });
  return state;
}
