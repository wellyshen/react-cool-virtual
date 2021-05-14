/* eslint-disable compat/compat */

import { useCallback, useRef } from "react";

import useLatest from "./useLatest";

interface Fn {
  (): void;
}

const now = () =>
  typeof performance === "object" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();

export default (cb: Fn, delay: number): [Fn, Fn] => {
  const rafRef = useRef<number | null>();
  const cbRef = useLatest(cb);

  const cancel = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

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

  const fn = useCallback(() => {
    cancel();
    tick(now());
  }, [cancel, tick]);

  return [fn, cancel];
};
