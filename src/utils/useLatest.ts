import { MutableRefObject, useRef } from "react";

export default <T>(val: T): MutableRefObject<T> => {
  const ref = useRef(val);
  ref.current = val;
  return ref;
};
