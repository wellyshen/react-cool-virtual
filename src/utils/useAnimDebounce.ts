import { useCallback, useRef } from "react";

import now from "./now";
import useLatest from "./useLatest";

interface Fn {
  (): void;
}

export default (cb: Fn, delay: number): [Fn, Fn] => {
  const rafRef = useRef<number>();
  const cbRef = useLatest(cb);

  const cancel = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
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
