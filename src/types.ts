import { RefObject } from "react";

export interface CalcData {
  start: number;
  end: number;
  offset: number;
  innerSize: number;
  idxRange: number;
}

export type Data = Record<string, any>;

export interface Item {
  data?: Data;
  readonly index: number;
  readonly size: number;
}

export type ItemSize = number | ((index: number) => number);

export interface Config<D> {
  itemData?: D;
  itemCount?: number;
  itemSize: ItemSize;
  isHorizontal?: boolean;
  overscanCount?: number;
}

export interface Return<O, I> {
  outerRef: RefObject<O>;
  innerRef: RefObject<I>;
  items: Item[];
}
