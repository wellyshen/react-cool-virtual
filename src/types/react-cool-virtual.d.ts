declare module "react-cool-virtual" {
  import { RefObject } from "react";

  type Data = Record<string, any>;

  interface Item<D> {
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

  interface ScrollTo {
    (offset: number): void;
    (options: ScrollOptions): void;
  }

  export type Options<D extends Data = Data> = Partial<{
    itemData: D[];
    itemCount: number;
    itemSize: ItemSize;
    horizontal: boolean;
    overscanCount: number;
    useIsScrolling: boolean;
    scrollingEffect: ScrollingEffect;
    onScroll: OnScroll;
  }>;

  export interface Return<
    O extends HTMLElement = HTMLElement,
    I extends HTMLElement = HTMLElement,
    D extends Data = Data
  > {
    outerRef: RefObject<O>;
    innerRef: RefObject<I>;
    items: Item<D>[];
    scrollTo: ScrollTo;
  }

  export default function useVirtual<
    O extends HTMLElement = HTMLElement,
    I extends HTMLElement = HTMLElement,
    D extends Data = Data
  >(config: Options<D>): Return<O, I, D>;
}
