export default (
  low: number,
  high: number,
  input: number,
  getVal: (idx: number) => number
): number => {
  while (low <= high) {
    const mid = ((low + high) / 2) | 0;
    const val = getVal(mid);

    if (input < val) {
      high = mid - 1;
    } else if (input > val) {
      low = mid + 1;
    } else {
      return mid;
    }
  }

  return low > 0 ? low - 1 : 0;
};
