import { Item } from "../types";

export default (
  prev: Item[],
  next: Item[],
  skip: Record<string, boolean>
): boolean => {
  if (prev.length !== next.length) return true;

  for (let i = 0; i < prev.length; i += 1)
    if (
      Object.keys(prev[i]).some((key) => {
        const k = key as keyof Item;
        return !skip[k] && prev[i][k] !== next[i][k];
      })
    )
      return true;

  return false;
};
