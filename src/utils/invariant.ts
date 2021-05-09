export default (condition: boolean, message: string): void => {
  if (__DEV__ && condition) throw new Error(message);
};
