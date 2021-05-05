import { MutableRefObject, useLayoutEffect, useRef, useState } from "react";

type Data = Record<string, any>;

interface Item<I> {
  data?: Data;
  readonly index: number;
  ref: (element: I) => void;
}

interface Options<D> {
  itemData?: D;
  itemCount?: number;
  itemSize: number;
  extendCount?: number;
}

interface Return<C, I> {
  containerRef: MutableRefObject<C | undefined>;
  items: Item<I>[];
}

const useVirtual = <
  C extends HTMLElement = HTMLElement,
  I extends HTMLElement = HTMLElement,
  D extends Data[] = Data[]
>({
  itemData,
  itemCount,
  itemSize,
  extendCount = 2,
}: Options<D>): Return<C, I> => {
  const containerRef = useRef<C>();
  const itemNumRef = useRef(
    new Array(itemCount !== undefined ? itemCount : itemData?.length).fill({})
  );
  const itemDataRef = useRef<D | undefined>(itemData);
  const [items, setItems] = useState<Item<I>[]>([]);

  useLayoutEffect(() => {
    const { current: container } = containerRef;
    const { current: itemNum } = itemNumRef;

    if (!container || !itemNum.length || !itemSize) return () => null;

    const { paddingTop, paddingBottom } = getComputedStyle(container);
    const pT = +paddingTop.replace("px", "");
    const pB = +paddingBottom.replace("px", "");
    const displayCount = (container.clientHeight - pT + pB) / itemSize;

    const updateItems = (index: number) => {
      const start = Math.max(index - extendCount, 0);
      const end = Math.min(index + displayCount + extendCount, itemNum.length);
      const mT = start * itemSize;
      const mB = (itemNum.length - end) * itemSize;

      setItems(
        itemNum.slice(start, end).map((_, idx, arr) => {
          const { current: data } = itemDataRef;
          const nextIdx = idx + start;

          return {
            data: data ? data[nextIdx] : undefined,
            index: nextIdx,
            ref: (el: I) => {
              if (!el) return;

              el.style.marginTop = "";
              el.style.marginBottom = "";
              el.style.height = `${itemSize}px`;

              if (!idx) el.style.marginTop = `${mT}px`;
              if (idx === arr.length - 1) el.style.marginBottom = `${mB}px`;
            },
          };
        })
      );
    };

    updateItems(0);

    let prevStartIdx: number;

    const scrollHandler = ({ target }: Event) => {
      const { scrollTop } = target as C;
      const idx = Math.floor(scrollTop / itemSize);

      if (idx !== prevStartIdx) {
        updateItems(idx);
        prevStartIdx = idx;
      }
    };

    container.addEventListener("scroll", scrollHandler);

    return () => {
      container.removeEventListener("scroll", scrollHandler);
    };
  }, [extendCount, itemCount, itemSize]);

  return { containerRef, items };
};

export default useVirtual;
