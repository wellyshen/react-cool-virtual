/**
 * @jest-environment node
 */

import { useEffect } from "react";
import { useIsoLayoutEffect } from "../utils";

describe("useIsoLayoutEffect", () => {
  it("should work correctly", () => {
    expect(useIsoLayoutEffect).toEqual(useEffect);
  });
});
