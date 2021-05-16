import { useCallback, useRef } from "react";

import now from "./now";
import useLatest from "./useLatest";

interface Fn {
  (): void;
}

export default (cb: Fn, delay: number): [Fn, Fn] => {
  const rafIdRef = useRef<number>();
  const cbRef = useLatest(cb);

  const cancel = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = undefined;
    }
  }, []);

  const tick = useCallback(
    (start: number) => {
      if (now() - start >= delay) {
        cbRef.current();
      } else {
        rafIdRef.current = requestAnimationFrame(() => tick(start));
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
