import { RefObject } from "react";

export interface Cache {
  start: number;
  end: number;
  totalSize: number;
  margin: number;
}

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
  overscanCount?: number;
}

export interface Return<O, I> {
  outerRef: RefObject<O>;
  innerRef: RefObject<I>;
  items: Item[];
}
