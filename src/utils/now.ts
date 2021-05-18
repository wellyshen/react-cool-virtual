export default (): number =>
  // eslint-disable-next-line compat/compat
  performance !== undefined ? performance.now() : Date.now();
