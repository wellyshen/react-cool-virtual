import isUndefined from "./isUndefined";

describe("isUndefined", () => {
  it("should work correctly", () => {
    expect(isUndefined(null)).toBeFalsy();
    expect(isUndefined(NaN)).toBeFalsy();
    expect(isUndefined(true)).toBeFalsy();
    expect(isUndefined(1)).toBeFalsy();
    expect(isUndefined("")).toBeFalsy();
    expect(isUndefined([])).toBeFalsy();
    expect(isUndefined({})).toBeFalsy();
    expect(isUndefined(new Date())).toBeFalsy();
    expect(isUndefined(() => null)).toBeFalsy();
    expect(isUndefined(undefined)).toBeTruthy();
  });
});
