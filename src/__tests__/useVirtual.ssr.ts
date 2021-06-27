/**
 * @jest-environment node
 */

import { renderHook } from "@testing-library/react-hooks/server";

import useVirtual from "../useVirtual";

describe("useVirtual SSR", () => {
  it("should return `items` correctly with specified `ssrItemCount`", () => {
    const ssrItemCount = 5;
    const { items } = renderHook(() =>
      useVirtual({ itemCount: 10, ssrItemCount })
    ).result.current;
    const item = {
      index: 0,
      start: 0,
      size: 50,
      width: 0,
      measureRef: expect.any(Function),
    };
    expect(items).toHaveLength(ssrItemCount);
    expect(items[0]).toEqual(item);
    expect(items[ssrItemCount - 1]).toEqual({ ...item, index: 4 });
  });
});
