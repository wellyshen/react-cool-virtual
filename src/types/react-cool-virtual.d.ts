declare module "react-cool-virtual" {
  import { RefObject } from "react";

  type Data = Record<string, any>;

  interface Item {
    data?: Data;
    readonly index: number;
    readonly size: number;
    measureRef: (el: HTMLElement | null) => void;
  }

  export type ItemSize = number | ((index: number) => number) | undefined;

  export type Config<D extends Data[] = Data[]> = Partial<{
    itemData: D;
    itemCount: number;
    itemSize: ItemSize;
    defaultItemSize: number;
    isHorizontal: boolean;
    overscanCount: number;
  }>;

  export interface Return<
    O extends HTMLElement = HTMLElement,
    I extends HTMLElement = HTMLElement
  > {
    outerRef: RefObject<O>;
    innerRef: RefObject<I>;
    items: Item[];
  }

  export default function useVirtual<
    O extends HTMLElement = HTMLElement,
    I extends HTMLElement = HTMLElement,
    D extends Data[] = Data[]
  >(config: Config<D>): Return<O, I>;
}
