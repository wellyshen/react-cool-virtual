export default (
  low: number,
  high: number,
  offset: number,
  getVal: (idx: number) => number
): number => {
  while (low <= high) {
    const middle = ((low + high) / 2) | 0;
    const val = getVal(middle);

    if (offset < val) {
      high = middle - 1;
    } else if (offset > val) {
      low = middle + 1;
    } else {
      return middle;
    }
  }

  return low > 0 ? low - 1 : 0;
};
