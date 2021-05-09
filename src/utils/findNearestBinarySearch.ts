export default (
  low: number,
  high: number,
  offset: number,
  ranges: number[]
): number => {
  while (low <= high) {
    const middle = ((low + high) / 2) | 0;

    if (offset === ranges[middle]) return middle;

    if (offset < ranges[middle]) {
      high = middle - 1;
    } else {
      low = middle + 1;
    }
  }

  return low > 0 ? low - 1 : 0;
};
