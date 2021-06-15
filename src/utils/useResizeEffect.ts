import { DependencyList, RefObject } from "react";

import { OnResize } from "../types";
import useIsoLayoutEffect from "./useIsoLayoutEffect";
import useLatest from "./useLatest";

export default <T extends HTMLElement>(
  ref: RefObject<T>,
  cb: OnResize,
  deps: DependencyList
): void => {
  const cbRef = useLatest(cb);

  useIsoLayoutEffect(() => {
    if (!ref?.current) return () => null;

    // eslint-disable-next-line compat/compat
    const observer = new ResizeObserver(([{ contentRect }]) => {
      const { width, height } = contentRect;
      cbRef.current({ width, height });
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [cbRef, ref, ...deps]);
};
