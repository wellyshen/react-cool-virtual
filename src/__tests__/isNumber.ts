import { isNumber } from "../utils";

describe("isNumber", () => {
  it("should work correctly", () => {
    expect(isNumber(null)).toBeFalsy();
    expect(isNumber(NaN)).toBeFalsy();
    expect(isNumber(true)).toBeFalsy();
    expect(isNumber("")).toBeFalsy();
    expect(isNumber([])).toBeFalsy();
    expect(isNumber({})).toBeFalsy();
    expect(isNumber(new Date())).toBeFalsy();
    expect(isNumber(() => null)).toBeFalsy();
    expect(isNumber(undefined)).toBeFalsy();
    expect(isNumber(1)).toBeTruthy();
  });
});
