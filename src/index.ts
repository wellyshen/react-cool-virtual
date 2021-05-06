import { useLayoutEffect, useRef, useState } from "react";

import { Data, Item, Config, Return } from "./types";

const useVirtual = <
  O extends HTMLElement = HTMLElement,
  I extends HTMLElement = HTMLElement,
  D extends Data[] = Data[]
>({
  itemData,
  itemCount,
  itemSize,
  isHorizontal,
  extendCount = 2,
}: Config<D>): Return<O, I> => {
  const outerRef = useRef<O>(null);
  const innerRef = useRef<I>(null);
  const itemNumRef = useRef(
    new Array(itemCount !== undefined ? itemCount : itemData?.length).fill({})
  );
  const itemDataRef = useRef<D | undefined>(itemData);
  const [items, setItems] = useState<Item[]>([]);

  useLayoutEffect(() => {
    const { current: container } = outerRef;
    const { current: wrapper } = innerRef;
    const { current: itemNum } = itemNumRef;

    if (!container || !wrapper || !itemNum.length || !itemSize)
      return () => null;

    const { paddingTop, paddingBottom } = getComputedStyle(container);
    const pT = +paddingTop.replace("px", "");
    const pB = +paddingBottom.replace("px", "");
    const displayCount = (container.clientHeight - pT + pB) / itemSize;

    const updateItems = (index: number) => {
      const start = Math.max(index - extendCount, 0);
      const end = Math.min(index + displayCount + extendCount, itemNum.length);

      wrapper.style.paddingTop = `${start * itemSize}px`;
      wrapper.style.paddingBottom = `${(itemNum.length - end) * itemSize}px`;

      setItems(
        itemNum.slice(start, end).map((_, idx) => {
          const { current: data } = itemDataRef;
          const nextIdx = idx + start;

          return {
            data: data ? data[nextIdx] : undefined,
            index: nextIdx,
            size: itemSize,
          };
        })
      );
    };

    updateItems(0);

    let prevStartIdx: number;

    const scrollHandler = ({ target }: Event) => {
      const { scrollTop } = target as O;
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

  return { outerRef, innerRef, items };
};

export default useVirtual;
