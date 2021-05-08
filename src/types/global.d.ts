declare const __DEV__: boolean;

interface Window {
  requestIdleCallback: (
    callback: (deadline: {
      readonly didTimeout: boolean;
      timeRemaining: () => number;
    }) => void,
    options?: { timeout: number }
  ) => any;
}
