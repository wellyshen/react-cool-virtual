import { MutableRefObject } from "react";

// Internal
export interface Measure {
  idx: number;
  start: number;
  end: number;
  size: number;
}

// External
export type SsrItemCount = number | [number, number];

type UseIsScrolling = boolean | ((speed: number) => boolean);

export type ItemSize = number | ((index: number, width: number) => number);

interface ScrollEasingFunction {
  (time: number): number;
}

interface IsItemLoaded {
  (index: number): boolean;
}

interface LoadMore {
  (event: {
    startIndex: number;
    stopIndex: number;
    loadIndex: number;
    readonly scrollOffset: number;
    readonly userScroll: boolean;
  }): void;
}

interface OnScroll {
  (event: {
    overscanStartIndex: number;
    overscanStopIndex: number;
    visibleStartIndex: number;
    visibleStopIndex: number;
    readonly scrollOffset: number;
    readonly scrollForward: boolean;
    readonly userScroll: boolean;
  }): void;
}

interface OnResize {
  (event: { width: number; height: number }): void;
}

export interface Item {
  readonly index: number;
  readonly start: number;
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
  useIsScrolling?: UseIsScrolling;
  scrollDuration?: number;
  scrollEasingFunction?: ScrollEasingFunction;
  loadMoreCount?: number;
  isItemLoaded?: IsItemLoaded;
  loadMore?: LoadMore;
  onScroll?: OnScroll;
  onResize?: OnResize;
}

export interface Return<O, I> {
  outerRef: MutableRefObject<O | null>;
  innerRef: MutableRefObject<I | null>;
  items: Item[];
  scrollTo: ScrollTo;
  scrollToItem: ScrollToItem;
}
