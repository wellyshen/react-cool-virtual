import { RefObject } from "react";

export type Data = Record<string, any>;

export interface CalcData {
  start: number;
  end: number;
  offset: number;
  innerSize: number;
  idxRange: number;
}

export interface Item<D> {
  data?: D;
  readonly index: number;
  readonly size: number;
  measureRef: (el: HTMLElement | null) => void;
}

export type ItemSize = number | ((index: number) => number) | undefined;

export type Config<D> = Partial<{
  itemData: D[];
  itemCount: number;
  itemSize: ItemSize;
  defaultItemSize: number;
  isHorizontal: boolean;
  overscanCount: number;
}>;

export interface Return<O, I, D> {
  outerRef: RefObject<O>;
  innerRef: RefObject<I>;
  items: Item<D>[];
}
