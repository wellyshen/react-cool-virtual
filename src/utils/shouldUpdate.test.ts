import shouldUpdate from "./shouldUpdate";

describe("shouldUpdate", () => {
  it("should work correctly", () => {
    const a = {
      index: 0,
      start: 0,
      size: 0,
      width: 0,
      measureRef: () => null,
    };
    const b = { ...a, measureRef: () => null };
    expect(shouldUpdate([a], [b], {})).toBeTruthy();
    expect(shouldUpdate([a], [b], { measureRef: true })).toBeFalsy();
    expect(
      shouldUpdate([a], [{ ...b, index: 1 }], { measureRef: true })
    ).toBeTruthy();
  });
});
