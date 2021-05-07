import { useCallback, useRef, useState } from "react";

import { Cache, Data, Item, Config, Return } from "./types";
import useIsoLayoutEffect from "./useIsoLayoutEffect";

export default function useVirtual<
  O extends HTMLElement = HTMLElement,
  I extends HTMLElement = HTMLElement,
  D extends Data[] = Data[]
>({
  itemData,
  itemCount,
  itemSize,
  isHorizontal,
  overscanCount = 2,
}: Config<D>): Return<O, I> {
  const sizeKey = !isHorizontal ? "height" : "width";
  const clientSizeKey = !isHorizontal ? "clientHeight" : "clientWidth";
  const marginKey = !isHorizontal ? "marginTop" : "marginLeft";
  const paddingTLKey = !isHorizontal ? "paddingTop" : "paddingLeft";
  const paddingBRKey = !isHorizontal ? "paddingBottom" : "paddingRight";
  const scrollKey = !isHorizontal ? "scrollTop" : "scrollLeft";
  const outerRef = useRef<O>(null);
  const innerRef = useRef<I>(null);
  const itemCountRef = useRef(
    new Array(itemCount !== undefined ? itemCount : itemData?.length).fill(true)
  );
  const itemDataRef = useRef<D | undefined>(itemData);
  const cacheRef = useRef<Cache[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const getCalcData = useCallback(
    (idx: number) => {
      const { current: outer } = outerRef;
      const { current: iCount } = itemCountRef;

      if (!outer) throw Error("Outer error");
      if (!iCount) throw Error("Item count errors");

      const style = getComputedStyle(outer);
      const padding =
        +style[paddingTLKey].replace("px", "") +
        +style[paddingBRKey].replace("px", "");
      const displayCount = (outer[clientSizeKey] - padding) / itemSize;
      const start = Math.max(idx - overscanCount, 0);

      if (!cacheRef.current[idx])
        cacheRef.current[idx] = {
          start,
          end: Math.min(idx + displayCount + overscanCount, iCount.length),
          margin: start * itemSize,
          totalSize: (iCount.length - start) * itemSize,
        };

      return cacheRef.current[idx];
    },
    [clientSizeKey, itemSize, overscanCount, paddingBRKey, paddingTLKey]
  );

  const updateItems = useCallback(
    (idx: number) => {
      const { current: inner } = innerRef;

      if (!inner) throw Error("Inner error");

      const { start, end, margin, totalSize } = getCalcData(idx);

      inner.style[marginKey] = `${margin}px`;
      inner.style[sizeKey] = `${totalSize}px`;

      setItems(
        itemCountRef.current.slice(start, end).map((_, i) => {
          const { current: data } = itemDataRef;
          const nextIdx = i + start;

          return {
            data: data ? data[nextIdx] : undefined,
            index: nextIdx,
            size: itemSize,
          };
        })
      );
    },
    [getCalcData, itemSize, marginKey, sizeKey]
  );

  useIsoLayoutEffect(() => {
    updateItems(0);

    let prevStartIdx: number;

    const scrollHandler = ({ target }: Event) => {
      const idx = Math.floor((target as O)[scrollKey] / itemSize);

      if (idx !== prevStartIdx) {
        updateItems(idx);
        prevStartIdx = idx;
      }
    };

    const { current: outer } = outerRef;

    outer?.addEventListener("scroll", scrollHandler);

    return () => {
      outer?.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  return { outerRef, innerRef, items };
}
