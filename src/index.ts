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
  overscanCount = 2,
}: Config<D>): Return<O, I> => {
  const outerRef = useRef<O>(null);
  const innerRef = useRef<I>(null);
  const itemNumRef = useRef(
    new Array(itemCount !== undefined ? itemCount : itemData?.length).fill(true)
  );
  const itemDataRef = useRef<D | undefined>(itemData);
  const [items, setItems] = useState<Item[]>([]);

  useLayoutEffect(() => {
    const { current: outer } = outerRef;
    const { current: inner } = innerRef;
    const { current: itemNum } = itemNumRef;

    if (!outer || !inner || !itemNum.length || !itemSize) return () => null;

    const {
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
    } = getComputedStyle(outer);
    const padding = !isHorizontal
      ? +paddingTop.replace("px", "") + +paddingBottom.replace("px", "")
      : +paddingLeft.replace("px", "") + +paddingRight.replace("px", "");
    const displayCount =
      (outer[!isHorizontal ? "clientHeight" : "clientWidth"] - padding) /
      itemSize;

    const updateItems = (index: number) => {
      const start = Math.max(index - overscanCount, 0);
      const end = Math.min(
        index + displayCount + overscanCount,
        itemNum.length
      );

      inner.style[!isHorizontal ? "marginTop" : "marginLeft"] = `${
        start * itemSize
      }px`;
      inner.style[!isHorizontal ? "height" : "width"] = `${
        (itemNum.length - start) * itemSize
      }px`;

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
      const { scrollTop, scrollLeft } = target as O;
      const idx = Math.floor(
        (!isHorizontal ? scrollTop : scrollLeft) / itemSize
      );

      if (idx !== prevStartIdx) {
        updateItems(idx);
        prevStartIdx = idx;
      }
    };

    outer.addEventListener("scroll", scrollHandler);

    return () => {
      outer.removeEventListener("scroll", scrollHandler);
    };
  }, [overscanCount, isHorizontal, itemSize]);

  return { outerRef, innerRef, items };
};

export default useVirtual;
