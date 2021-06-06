export default (
  low: number,
  high: number,
  target: number,
  getVal: (idx: number) => number,
  defaultVal?: number
): number => {
  while (low <= high) {
    const mid = ((low + high) / 2) | 0;
    const val = getVal(mid);

    if (target < val) {
      high = mid - 1;
    } else if (target > val) {
      low = mid + 1;
    } else {
      return mid;
    }
  }

  return defaultVal ?? low > 0 ? low - 1 : 0;
};
