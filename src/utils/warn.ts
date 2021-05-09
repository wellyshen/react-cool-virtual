export default (...args: any[]): void => {
  if (__DEV__) console.warn(...args);
};
