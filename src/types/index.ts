import { RefObject } from "react";

export interface Measure {
  start: number;
  end: number;
  size: number;
}

export type Data = Record<string, any>;

export interface Item<D> {
  data?: D;
  readonly index: number;
  readonly size: number;
  readonly outerSize: number;
  readonly isScrolling?: boolean;
  measureRef: (el: HTMLElement | null) => void;
}

export type ItemSize = number | ((index: number) => number) | undefined;

export interface OnScroll {
  (options: {
    overscanIndexes: number[];
    itemIndexes: number[];
    offset: number;
    direction: string;
    userScroll: boolean;
  }): void;
}

export type Options<D> = Partial<{
  itemData: D[];
  itemCount: number;
  itemSize: ItemSize;
  defaultItemSize: number;
  horizontal: boolean;
  overscanCount: number;
  useIsScrolling: boolean;
  onScroll: OnScroll;
}>;

export interface Return<O, I, D> {
  outerRef: RefObject<O>;
  innerRef: RefObject<I>;
  items: Item<D>[];
}
