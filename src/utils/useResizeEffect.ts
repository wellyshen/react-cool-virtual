import { DependencyList, RefObject, useRef } from "react";

import { OnResize } from "../types";
import useIsoLayoutEffect from "./useIsoLayoutEffect";
import useLatest from "./useLatest";

export default <T extends HTMLElement>(
  ref: RefObject<T>,
  cb: OnResize,
  deps: DependencyList,
  useWindowScroll?: boolean
): void => {
  const cbRef = useLatest(cb);
  const rectRef = useRef({});

  useIsoLayoutEffect(() => {
    if (!ref?.current) return () => null;

    // eslint-disable-next-line compat/compat
    const observer = new ResizeObserver(([{ contentRect, target }]) => {
      const { right, bottom } = target.getBoundingClientRect();
      const { width, height } = contentRect;

      rectRef.current = {
        outerWidth: width,
        outerHeight: height,
        outerRight: right,
        outerBottom: bottom,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      };

      cbRef.current(rectRef.current);
    });

    observer.observe(ref.current);

    const resizeHandler = () =>
      cbRef.current({
        ...rectRef.current,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      });

    if (useWindowScroll) window.addEventListener("resize", resizeHandler);

    return () => {
      observer.disconnect();
      if (useWindowScroll) window.removeEventListener("resize", resizeHandler);
    };
  }, [cbRef, ref, ...deps]);
};
