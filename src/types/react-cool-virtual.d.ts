declare module "react-cool-virtual" {
  import { MutableRefObject } from "react";

  export interface ItemSizeFunction {
    (index: number, width: number): number;
  }

  export type ItemSize = number | ItemSizeFunction;

  export interface UseIsScrollingFunction {
    (speed: number): boolean;
  }

  export type UseIsScrolling = boolean | UseIsScrollingFunction;

  export interface ScrollEasingFunction {
    (time: number): number;
  }

  export interface KeyExtractor {
    (index: number): string;
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

  export interface MeasureRef {
    (el: HTMLElement | null): void;
  }

  export interface Item {
    readonly key?: string;
    readonly index: number;
    readonly start: number;
    readonly size: number;
    readonly width: number;
    readonly isScrolling?: boolean;
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
    overscanCount?: number;
    useIsScrolling?: UseIsScrolling;
    scrollDuration?: number;
    scrollEasingFunction?: ScrollEasingFunction;
    keyExtractor?: KeyExtractor;
    loadMoreThreshold?: number;
    isItemLoaded?: IsItemLoaded;
    loadMore?: LoadMore;
    onScroll?: OnScroll;
    onResize?: OnResize;
  }

  export interface Return<
    O extends HTMLElement = HTMLElement,
    I extends HTMLElement = HTMLElement
  > {
    outerRef: MutableRefObject<O | null>;
    innerRef: MutableRefObject<I | null>;
    items: Item[];
    scrollTo: ScrollTo;
    scrollToItem: ScrollToItem;
  }

  export default function useVirtual<
    O extends HTMLElement = HTMLElement,
    I extends HTMLElement = HTMLElement
  >(config: Options): Return<O, I>;
}
