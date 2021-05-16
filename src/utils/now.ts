import isUndefined from "./isUndefined";

export default (): number =>
  // eslint-disable-next-line compat/compat
  !isUndefined(performance) ? performance.now() : Date.now();
