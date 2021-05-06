import { RefObject } from "react";

export type Data = Record<string, any>;

export interface Item<I> {
  data?: Data;
  readonly index: number;
  ref: (element: I) => void;
}

export interface Config<D> {
  itemData?: D;
  itemCount?: number;
  itemSize: number;
  extendCount?: number;
}

export interface Return<C, I> {
  containerRef: RefObject<C>;
  items: Item<I>[];
}
