declare module "react-cool-virtual" {
  import { MutableRefObject, RefCallback } from "react";

  export interface ItemSizeFunction {
    (index: number, width: number): number;
  }

  export type ItemSize = number | ItemSizeFunction;

  export interface UseIsScrollingFunction {
    (speed: number): boolean;
  }

  export type UseIsScrolling = boolean | UseIsScrollingFunction;

  export type ScrollDuration = number | ((distance: number) => number);

  export interface ScrollEasingFunction {
    (time: number): number;
  }

  export interface IsItemLoaded {
    (index: number): boolean;
  }

  export interface LoadMoreEvent {
    startIndex: number;
    stopIndex: number;
    loadIndex: number;
    readonly scrollOffset: number;
    readonly userScroll: boolean;
  }

  export interface LoadMore {
    (event: LoadMoreEvent): void;
  }

  export interface OnScrollEvent {
    overscanStartIndex: number;
    overscanStopIndex: number;
    visibleStartIndex: number;
    visibleStopIndex: number;
    readonly scrollOffset: number;
    readonly scrollForward: boolean;
    readonly userScroll: boolean;
  }

  export interface OnScroll {
    (event: OnScrollEvent): void;
  }

  export interface OnResizeEvent {
    width: number;
    height: number;
  }

  export interface OnResize {
    (event: OnResizeEvent): void;
  }

  export type MeasureRef = RefCallback<HTMLElement>;

  export interface Item {
    readonly index: number;
    readonly start: number;
    readonly size: number;
    readonly width: number;
    readonly isScrolling?: true;
    readonly isSticky?: true;
    measureRef: MeasureRef;
  }

  export interface Callback {
    (): void;
  }

  export interface ScrollToOptions {
    offset: number;
    smooth?: boolean;
  }

  export interface ScrollTo {
    (offset: number, callback?: Callback): void;
    (options: ScrollToOptions, callback?: Callback): void;
  }

  export interface ScrollToItemOptions {
    index: number;
    align?: "auto" | "start" | "center" | "end";
    smooth?: boolean;
  }

  export interface ScrollToItem {
    (index: number, callback?: Callback): void;
    (options: ScrollToItemOptions, callback?: Callback): void;
  }

  export interface Options {
    itemCount: number;
    ssrItemCount?: number | [number, number];
    itemSize?: ItemSize;
    horizontal?: boolean;
    resetScroll?: boolean;
    overscanCount?: number;
    useIsScrolling?: UseIsScrolling;
    stickyIndices?: number[];
    scrollDuration?: ScrollDuration;
    scrollEasingFunction?: ScrollEasingFunction;
    loadMoreCount?: number;
    isItemLoaded?: IsItemLoaded;
    loadMore?: LoadMore;
    onScroll?: OnScroll;
    onResize?: OnResize;
  }

  export interface Return<
    O extends HTMLElement = HTMLElement,
    I extends HTMLElement = O
  > {
    outerRef: MutableRefObject<O | null>;
    innerRef: MutableRefObject<I | null>;
    items: Item[];
    scrollTo: ScrollTo;
    scrollToItem: ScrollToItem;
  }

  export default function useVirtual<
    O extends HTMLElement = HTMLElement,
    I extends HTMLElement = O
  >(config: Options): Return<O, I>;
}
