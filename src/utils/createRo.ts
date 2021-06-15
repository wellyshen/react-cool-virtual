import { OnResize, OnResizeEvent } from "../types";

interface Options {
  roCallback: OnResize;
  observe: () => void;
  disconnect: () => void;
}

type Return = jest.Mock<Omit<Options, "roCallback">>;

export default (
  contentRect: OnResizeEvent,
  {
    roCallback,
    observe = () => null,
    disconnect = () => null,
  }: Partial<Options> = {}
): Return =>
  jest.fn((cb) => ({
    observe: () => {
      if (roCallback) roCallback = cb;
      cb([{ contentRect }]);
      observe();
    },
    disconnect,
  }));
