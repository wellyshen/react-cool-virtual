import { RefObject } from "react";

import useIsoLayoutEffect from "./useIsoLayoutEffect";
import useLatest from "./useLatest";

export default <T extends HTMLElement>(
  ref: RefObject<T>,
  cb: (rect: { height: number; width: number }) => void
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
  }, [cbRef, ref]);
};
