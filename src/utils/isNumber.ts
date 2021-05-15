export default (value: unknown): value is number =>
  typeof value === "number" && !Number.isNaN(value);
