export default (): number =>
  // eslint-disable-next-line compat/compat
  "performance" in window ? performance.now() : Date.now();
