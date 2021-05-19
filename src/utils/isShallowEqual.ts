import { Item } from "../types";

const isPrimitive = (value: unknown) =>
  value == null || /^[sbn]/.test(typeof value);

export default (arrA: Item[], arrB: Item[]): boolean => {
  if (arrA.length !== arrB.length) return false;

  for (let i = 0; i < arrA.length; i += 1)
    if (
      Object.keys(arrA[i]).some((key) => {
        const k = key as keyof Item;
        return isPrimitive(arrA[i][k]) ? arrA[i][k] !== arrB[i][k] : false;
      })
    )
      return false;

  return true;
};
