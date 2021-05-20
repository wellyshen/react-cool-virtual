declare module "react-cool-virtual" {
  import { RefObject } from "react";

  export type ItemSize = number | ((index: number) => number);

  export interface ScrollEasingFunction {
    (time: number): number;
  }

  export interface KeyExtractor {
    (index: number): string;
  }

  export interface IsItemLoaded {
    (index: number): boolean;
  }

  export type LoadMoreEvent = {
    startIndex: number;
    stopIndex: number;
    batchIndex: number;
    readonly scrollOffset: number;
  };

  export interface LoadMore {
    (event: LoadMoreEvent): void;
  }

  export interface OnScrollEvent {
    overscanStartIndex: number;
    overscanStopIndex: number;
    itemStartIndex: number;
    itemStopIndex: number;
    readonly scrollOffset: number;
    readonly scrollForward: boolean;
    readonly userScroll: boolean;
  }

  export interface OnScroll {
    (event: OnScrollEvent): void;
  }

  export interface MeasureRef {
    (el: HTMLElement | null): void;
  }

  export interface Item {
    readonly key?: string;
    readonly index: number;
    readonly size: number;
    readonly outerSize: number;
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
    autoCorrect?: boolean;
  }

  export interface ScrollToItem {
    (index: number, callback?: Callback): void;
    (options: ScrollToItemOptions, callback?: Callback): void;
  }

  export interface Options {
    itemCount: number;
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

  export interface Return<
    O extends HTMLElement = HTMLElement,
    I extends HTMLElement = HTMLElement
  > {
    outerRef: RefObject<O>;
    innerRef: RefObject<I>;
    items: Item[];
    scrollTo: ScrollTo;
    scrollToItem: ScrollToItem;
  }

  export default function useVirtual<
    O extends HTMLElement = HTMLElement,
    I extends HTMLElement = HTMLElement
  >(config: Options): Return<O, I>;
}
