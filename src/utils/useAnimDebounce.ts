/* eslint-disable compat/compat */

import { useCallback, useRef } from "react";

import useLatest from "./useLatest";

const now = () =>
  typeof performance === "object" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();

export default (cb: () => void, delay: number): (() => void) => {
  const rafRef = useRef<number | null>();
  const cbRef = useLatest(cb);

  const tick = useCallback(
    (start: number) => {
      if (now() - start >= delay) {
        cbRef.current();
      } else {
        rafRef.current = requestAnimationFrame(() => tick(start));
      }
    },
    [cbRef, delay]
  );

  return useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    tick(now());
  }, [tick]);
};
