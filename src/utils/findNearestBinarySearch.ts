export default (
  low: number,
  high: number,
  offset: number,
  getVal: (idx: number) => number
): number => {
  while (low <= high) {
    const mid = ((low + high) / 2) | 0;
    const val = getVal(mid);

    if (offset < val) {
      high = mid - 1;
    } else if (offset > val) {
      low = mid + 1;
    } else {
      return mid;
    }
  }

  return low > 0 ? low - 1 : 0;
};
