import { renderHook } from "@testing-library/react-hooks";

import useDebounce from "./useDebounce";

describe("useDebounce", () => {
  jest.useFakeTimers();

  it("should trigger callback", () => {
    const cb = jest.fn();
    const { result } = renderHook(() => useDebounce(cb, 1000));
    result.current[0]();
    jest.advanceTimersByTime(500);
    expect(cb).not.toHaveBeenCalled();
    jest.advanceTimersByTime(510);
    expect(cb).toHaveBeenCalled();
  });

  it("should cancel callback", () => {
    const cb = jest.fn();
    const { result } = renderHook(() => useDebounce(cb, 1000));
    result.current[0]();
    jest.advanceTimersByTime(500);
    result.current[1]();
    jest.advanceTimersByTime(510);
    expect(cb).not.toHaveBeenCalled();
  });
});
