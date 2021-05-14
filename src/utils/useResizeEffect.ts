import { DependencyList, RefObject, useRef } from "react";
import { dequal } from "dequal/lite";

import useIsoLayoutEffect from "./useIsoLayoutEffect";
import useLatest from "./useLatest";

interface CB {
  (rect: { height: number; width: number }): void;
}

const useDeepCompare = (deps: DependencyList) => {
  const depsRef = useRef<DependencyList>();
  const signalRef = useRef(0);

  if (!dequal(deps, depsRef.current)) {
    depsRef.current = deps;
    signalRef.current += 1;
  }

  return [signalRef.current];
};

export default <T extends HTMLElement>(
  ref: RefObject<T>,
  cb: CB,
  deps: DependencyList
): void => {
  const cbRef = useLatest(cb);

  useIsoLayoutEffect(() => {
    if (!ref.current) return () => null;

    // eslint-disable-next-line compat/compat
    const observer = new ResizeObserver(
      ([
        {
          contentRect: { width, height },
        },
      ]) => cbRef.current({ width, height })
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, useDeepCompare([ref, cbRef, deps]));
};
