import { useCallback, useRef, useState, useLayoutEffect } from "react";

import { CalcData, Config, Data, Item, ItemSize, Return } from "./types";
// import useIsoLayoutEffect from "./useIsoLayoutEffect";
import useLatest from "./useLatest";
import invariant from "./invariant";
import warn from "./warn";

const DEFAULT_ITEM_SIZE = 50;

export default function useVirtual<
  O extends HTMLElement = HTMLElement,
  I extends HTMLElement = HTMLElement,
  D extends Data[] = Data[]
>({
  itemData,
  itemCount,
  itemSize = DEFAULT_ITEM_SIZE,
  isHorizontal,
  overscanCount = 2,
}: Config<D>): Return<O, I> {
  const [items, setItems] = useState<Item[]>([]);
  const hasWarn = useRef(false);
  const outerRef = useRef<O>(null);
  const innerRef = useRef<I>(null);
  const itemDataRef = useRef<D | undefined>(itemData);
  const outerSizeRef = useRef(0);
  const totalSizeRef = useRef(0);
  const calcDataRef = useRef<CalcData[]>([]);
  const itemSizeRef = useLatest<ItemSize>(itemSize);
  const sizeKey = !isHorizontal ? "height" : "width";
  const clientSizeKey = !isHorizontal ? "clientHeight" : "clientWidth";
  const marginKey = !isHorizontal ? "marginTop" : "marginLeft";
  const paddingTLKey = !isHorizontal ? "paddingTop" : "paddingLeft";
  const paddingBRKey = !isHorizontal ? "paddingBottom" : "paddingRight";
  const scrollKey = !isHorizontal ? "scrollTop" : "scrollLeft";
  itemCount = itemCount !== undefined ? itemCount : itemData?.length;

  if (overscanCount < 1) {
    overscanCount = 1;

    if (!hasWarn.current) {
      warn("overscanCount warning");
      hasWarn.current = true;
    }
  }

  const getOuterSize = useCallback(() => {
    const { current: outer } = outerRef;

    if (!outer) return 0;

    const style = getComputedStyle(outer);

    return (
      outer[clientSizeKey] -
      +style[paddingTLKey].replace("px", "") +
      +style[paddingBRKey].replace("px", "")
    );
  }, [clientSizeKey, paddingBRKey, paddingTLKey]);

  const getItemSize = useCallback(
    (idx: number) => {
      const { current: size } = itemSizeRef;
      if (typeof size === "number") return size;
      return size(idx) ?? DEFAULT_ITEM_SIZE;
    },
    [itemSizeRef]
  );

  const getTotalSize = useCallback(() => {
    if (!itemCount) return 0;

    let size = 0;

    for (let i = 0; i < itemCount; i += 1) size += getItemSize(i);

    return size;
  }, [getItemSize, itemCount]);

  const getDisplayCount = useCallback(
    (idx: number) => {
      let { current: outerSize } = outerSizeRef;

      if (typeof itemSizeRef.current === "number")
        return outerSize / itemSizeRef.current;

      let count = 0;

      while (outerSize > 0) {
        outerSize -= getItemSize(idx);
        count += 1;
        idx += 1;
      }

      return count;
    },
    [getItemSize, itemSizeRef]
  );

  const getCalcData = useCallback(() => {
    if (!itemCount) return [];

    const data: CalcData[] = [];

    for (let i = 0; i < itemCount; i += 1) {
      const start = Math.max(i - overscanCount, 0);
      const offset = start ? data[i - 1].offset + getItemSize(start - 1) : 0;

      data.push({
        start,
        end: Math.min(i + getDisplayCount(i) + overscanCount, itemCount),
        offset,
        innerSize: totalSizeRef.current - offset,
        idxRange: i ? data[i - 1].idxRange + getItemSize(i - 1) : 0,
      });
    }

    return data;
  }, [getDisplayCount, getItemSize, itemCount, overscanCount]);

  const updateItems = useCallback(
    (idx: number) => {
      const calcData = calcDataRef.current[idx];
      const { current: inner } = innerRef;

      if (!inner || !calcData) return;

      const { start, end, offset, innerSize } = calcData;

      inner.style[marginKey] = `${offset}px`;
      inner.style[sizeKey] = `${innerSize}px`;

      const nextItems = [];

      for (let i = start; i < end; i += 1)
        nextItems.push({
          data: itemDataRef.current ? itemDataRef.current[i] : undefined,
          index: i,
          size: getItemSize(i),
        });

      setItems(nextItems);
    },
    [getItemSize, marginKey, sizeKey]
  );

  const getScrollIdx = useCallback(
    (scrollVal: number) => {
      if (!itemCount) return 0;

      const ranges = calcDataRef.current.map(({ idxRange }) => idxRange);

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return findNearestBinarySearch(0, itemCount, scrollVal, ranges);
    },
    [itemCount]
  );

  useLayoutEffect(() => {
    const { current: outer } = outerRef;
    const { current: inner } = innerRef;

    invariant(!outer, "Outer error");
    invariant(!inner, "Inner error");
    invariant(itemCount === undefined, "Item count error");

    outerSizeRef.current = getOuterSize();
    totalSizeRef.current = getTotalSize();
    calcDataRef.current = getCalcData();

    updateItems(0);

    let prevIdx: number;

    const scrollHandler = ({ target }: Event) => {
      const idx = getScrollIdx((target as O)[scrollKey]);

      if (idx !== prevIdx) {
        updateItems(idx);
        prevIdx = idx;
      }
    };

    outer!.addEventListener("scroll", scrollHandler);

    return () => {
      outer!.removeEventListener("scroll", scrollHandler);
    };
  }, [
    getCalcData,
    getOuterSize,
    getScrollIdx,
    getTotalSize,
    itemCount,
    scrollKey,
    updateItems,
  ]);

  return { outerRef, innerRef, items };
}

const findNearestBinarySearch = (
  low: number,
  high: number,
  offset: number,
  ranges: number[]
) => {
  while (low <= high) {
    const middle = ((low + high) / 2) | 0;

    if (offset === ranges[middle]) return middle;

    if (offset < ranges[middle]) {
      high = middle - 1;
    } else {
      low = middle + 1;
    }
  }

  return low > 0 ? low - 1 : 0;
};
