declare module "react-cool-virtual" {
  import { RefObject } from "react";

  type Data = Record<string, any>;

  interface Item {
    data?: Data;
    readonly index: number;
    readonly size: number;
  }

  export interface Config<D extends Data[] = Data[]> {
    itemData?: D;
    itemCount?: number;
    itemSize: number;
    isHorizontal?: boolean;
    overscanCount?: number;
  }

  export interface Return<
    O extends HTMLElement = HTMLElement,
    I extends HTMLElement = HTMLElement,
    T extends HTMLElement = HTMLElement
  > {
    outerRef: RefObject<O>;
    innerRef: RefObject<I>;
    itemRef: RefObject<T>;
    items: Item[];
  }

  export default function useVirtual<
    O extends HTMLElement = HTMLElement,
    I extends HTMLElement = HTMLElement,
    T extends HTMLElement = HTMLElement,
    D extends Data[] = Data[]
  >(config: Config<D>): Return<O, I, T>;
}
