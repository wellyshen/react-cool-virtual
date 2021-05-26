export default (val: unknown): val is number =>
  typeof val === "number" && !Number.isNaN(val);
