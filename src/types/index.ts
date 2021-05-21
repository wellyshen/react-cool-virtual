import { RefObject } from "react";

// Internal
export interface Measure {
  key?: string;
  idx: number;
  start: number;
  end: number;
  size: number;
}

// External
export type SsrItemCount = number | [number, number];

export type ItemSize = number | ((index: number, width: number) => number);

export interface ScrollEasingFunction {
  (time: number): number;
}

export interface KeyExtractor {
  (index: number): string;
}

export interface IsItemLoaded {
  (index: number): boolean;
}

export interface LoadMore {
  (event: {
    startIndex: number;
    stopIndex: number;
    batchIndex: number;
    readonly scrollOffset: number;
  }): void;
}

export interface OnScroll {
  (event: {
    overscanStartIndex: number;
    overscanStopIndex: number;
    itemStartIndex: number;
    itemStopIndex: number;
    readonly scrollOffset: number;
    readonly scrollForward: boolean;
    readonly userScroll: boolean;
  }): void;
}

export interface Item {
  readonly key?: string;
  readonly index: number;
  readonly size: number;
  readonly width: number;
  readonly isScrolling?: boolean;
  measureRef: (el: HTMLElement | null) => void;
}

export interface ScrollToOptions {
  offset: number;
  smooth?: boolean;
}

export interface ScrollTo {
  (value: number | ScrollToOptions, callback?: () => void): void;
}

export enum Align {
  auto = "auto",
  start = "start",
  center = "center",
  end = "end",
}

export interface ScrollToItemOptions {
  index: number;
  align?: Align;
  smooth?: boolean;
  autoCorrect?: boolean;
}

export interface ScrollToItem {
  (index: number | ScrollToItemOptions, callback?: () => void): void;
}

export interface Options {
  itemCount: number;
  ssrItemCount?: SsrItemCount;
  itemSize?: ItemSize;
  horizontal?: boolean;
  overscanCount?: number;
  useIsScrolling?: boolean;
  scrollDuration?: number;
  scrollEasingFunction?: ScrollEasingFunction;
  keyExtractor?: KeyExtractor;
  loadMoreThreshold?: number;
  isItemLoaded?: IsItemLoaded;
  loadMore?: LoadMore;
  onScroll?: OnScroll;
}

export interface Return<O, I> {
  outerRef: RefObject<O>;
  innerRef: RefObject<I>;
  items: Item[];
  scrollTo: ScrollTo;
  scrollToItem: ScrollToItem;
}
