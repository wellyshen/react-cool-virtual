import { MutableRefObject, useRef, useEffect } from "react";

export default <T>(val: T): MutableRefObject<T> => {
  const ref = useRef(val);

  useEffect(() => {
    ref.current = val;
  });

  return ref;
};
