export default (
  low: number,
  high: number,
  offset: number,
  arr: number[]
): number => {
  while (low <= high) {
    const middle = ((low + high) / 2) | 0;

    if (offset < arr[middle]) {
      high = middle - 1;
    } else if (offset > arr[middle]) {
      low = middle + 1;
    } else {
      return middle;
    }
  }

  return low > 0 ? low - 1 : 0;
};
