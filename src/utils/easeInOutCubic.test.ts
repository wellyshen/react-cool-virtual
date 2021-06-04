import easeInOutCubic from "./easeInOutCubic";

describe("easeInOutCubic", () => {
  it("should work correctly", () => {
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeInOutCubic(5)).toBe(257);
    expect(easeInOutCubic(10)).toBe(2917);
  });
});
