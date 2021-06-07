import { useLayoutEffect } from "react";
import useIsoLayoutEffect from "./useIsoLayoutEffect";

describe("useIsoLayoutEffect", () => {
  it("should work correctly", () => {
    expect(useIsoLayoutEffect).toEqual(useLayoutEffect);
  });
});
