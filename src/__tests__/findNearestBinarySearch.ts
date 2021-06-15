import { findNearestBinarySearch } from "../utils";

describe("findNearestBinarySearch", () => {
  it("should work correctly", () => {
    const arr = [10, 20, 30, 40, 50];
    const getVal = (idx: number) => arr[idx];
    expect(findNearestBinarySearch(0, arr.length - 1, 10, getVal)).toBe(0);
    expect(findNearestBinarySearch(0, arr.length - 1, 50, getVal)).toBe(4);
    expect(findNearestBinarySearch(0, arr.length - 1, 31, getVal)).toBe(2);
    expect(findNearestBinarySearch(0, arr.length - 1, 39, getVal)).toBe(2);
    expect(findNearestBinarySearch(0, arr.length - 1, 0, getVal)).toBe(0);
    expect(findNearestBinarySearch(0, arr.length - 1, 5, getVal)).toBe(0);
    expect(findNearestBinarySearch(0, arr.length - 1, 60, getVal)).toBe(4);
  });
});
