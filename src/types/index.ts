import { RefObject } from "react";

export type Data = Record<string, any>;

export interface Item {
  data?: Data;
  readonly index: number;
  readonly size: number;
}

export interface Config<D> {
  itemData?: D;
  itemCount?: number;
  itemSize: number;
  isHorizontal?: boolean;
  extendCount?: number;
}

export interface Return<O, I> {
  outerRef: RefObject<O>;
  innerRef: RefObject<I>;
  items: Item[];
}
