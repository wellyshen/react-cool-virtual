declare module "react-cool-virtual" {
  import { RefObject } from "react";

  type Data = Record<string, any>;

  export type Items<D extends Data = Data> = number | D[];

  export type ItemSize = number | ((index: number) => number);

  export interface ScrollEasingFunction {
    (time: number): number;
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

  export interface VirtualItem<D extends Data = Data> {
    data?: D;
    readonly index: number;
    readonly size: number;
    readonly outerSize: number;
    readonly isScrolling?: boolean;
    measureRef: (el: HTMLElement | null) => void;
  }

  export interface ScrollToOptions {
    offset: number;
    smooth?: boolean;
  }

  export interface Callback {
    (): void;
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

  export type Options<D extends Data = Data> = Partial<{
    items: Items<D>;
    totalItems: number;
    itemSize: ItemSize;
    horizontal: boolean;
    overscanCount: number;
    useIsScrolling: boolean;
    scrollDuration: number;
    scrollEasingFunction: ScrollEasingFunction;
    onScroll: OnScroll;
  }>;

  export interface Return<
    O extends HTMLElement = HTMLElement,
    I extends HTMLElement = HTMLElement,
    D extends Data = Data
  > {
    outerRef: RefObject<O>;
    innerRef: RefObject<I>;
    virtualItems: VirtualItem<D>[];
    scrollTo: ScrollTo;
    scrollToItem: ScrollToItem;
  }

  export default function useVirtual<
    O extends HTMLElement = HTMLElement,
    I extends HTMLElement = HTMLElement,
    D extends Data = Data
  >(config: Options<D>): Return<O, I, D>;
}
