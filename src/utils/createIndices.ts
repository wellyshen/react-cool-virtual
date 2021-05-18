export default (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);
