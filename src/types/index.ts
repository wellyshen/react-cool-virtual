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

export type ItemSize = number | ((index: number) => number);

export interface ScrollingEffect {
  duration?: number;
  easingFunction?: (time: number) => number;
}

export interface OnScroll {
  (options: {
    overscanIndexes: number[];
    itemIndexes: number[];
    offset: number;
    direction: string;
    userScroll: boolean;
  }): void;
}

export interface ScrollOptions {
  offset: number;
  smooth?: boolean;
}

export interface ScrollTo {
  (value: number | ScrollOptions): void;
}

export type Options<D> = Partial<{
  itemData: D[];
  itemCount: number;
  itemSize: ItemSize;
  horizontal: boolean;
  overscanCount: number;
  useIsScrolling: boolean;
  scrollingEffect: ScrollingEffect;
  onScroll: OnScroll;
}>;

export interface Return<O, I, D> {
  outerRef: RefObject<O>;
  innerRef: RefObject<I>;
  items: Item<D>[];
  scrollTo: ScrollTo;
}
