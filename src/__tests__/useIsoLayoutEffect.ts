import { useLayoutEffect } from "react";
import { useIsoLayoutEffect } from "../utils";

describe("useIsoLayoutEffect", () => {
  it("should work correctly", () => {
    expect(useIsoLayoutEffect).toEqual(useLayoutEffect);
  });
});
