declare module "react-cool-virtual" {
  import { RefObject } from "react";

  type Data = Record<string, any>;

  interface Item<I> {
    data?: Data;
    readonly index: number;
    ref: (element: I) => void;
  }

  export interface Config<D extends Data[] = Data[]> {
    itemData?: D;
    itemCount?: number;
    itemSize: number;
    isHorizontal?: boolean;
    extendCount?: number;
  }

  export interface Return<
    C extends HTMLElement = HTMLElement,
    I extends HTMLElement = HTMLElement
  > {
    containerRef: RefObject<C>;
    items: Item<I>[];
  }

  export default function useVirtual<
    C extends HTMLElement = HTMLElement,
    I extends HTMLElement = HTMLElement,
    D extends Data[] = Data[]
  >(config: Config<D>): Return<C, I>;
}
