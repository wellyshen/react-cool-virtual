import { useCallback, useRef, useState, useLayoutEffect } from "react";

import { CalcData, Config, Data, Item, ItemSize, Return } from "./types";
import {
  findNearestBinarySearch,
  invariant,
  // useIsoLayoutEffect,
  useLatest,
  useResizeObserver,
  warn,
} from "./utils";

const DEFAULT_ITEM_SIZE = 50;

const useVirtual = <
  O extends HTMLElement = HTMLElement,
  I extends HTMLElement = HTMLElement,
  D extends Data[] = Data[]
>({
  itemData,
  itemCount,
  itemSize = DEFAULT_ITEM_SIZE,
  isHorizontal,
  overscanCount = 2,
}: Config<D>): Return<O, I> => {
  const [items, setItems] = useState<Item[]>([]);
  const [outerSize, setOuterSize] = useState(0);
  const hasWarn = useRef(false);
  const outerRef = useRef<O>(null);
  const innerRef = useRef<I>(null);
  const itemDataRef = useRef<D | undefined>(itemData);
  const totalSizeRef = useRef(0);
  const calcDataRef = useRef<CalcData[]>([]);
  const itemSizeRef = useLatest<ItemSize>(itemSize);
  const sizeKey = !isHorizontal ? "height" : "width";
  const marginKey = !isHorizontal ? "marginTop" : "marginLeft";
  const scrollKey = !isHorizontal ? "scrollTop" : "scrollLeft";
  itemCount = itemCount !== undefined ? itemCount : itemData?.length;

  if (overscanCount < 1) {
    overscanCount = 1;

    if (!hasWarn.current) {
      warn("overscanCount warning");
      hasWarn.current = true;
    }
  }

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
      if (typeof itemSizeRef.current === "number")
        return outerSize / itemSizeRef.current;

      let size = outerSize;
      let count = 0;

      while (size > 0) {
        size -= getItemSize(idx);
        count += 1;
        idx += 1;
      }

      return count;
    },
    [getItemSize, itemSizeRef, outerSize]
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

  useResizeObserver<O>(outerRef, (rect) => setOuterSize(rect[sizeKey]));

  useLayoutEffect(() => {
    const { current: outer } = outerRef;
    const { current: inner } = innerRef;

    invariant(!outer, "Outer error");
    invariant(!inner, "Inner error");
    invariant(itemCount === undefined, "Item count error");

    totalSizeRef.current = getTotalSize();
    calcDataRef.current = getCalcData();

    updateItems(0);

    let prevIdx: number;

    const scrollHandler = ({ target }: Event) => {
      const idx = findNearestBinarySearch(
        0,
        calcDataRef.current.length,
        (target as O)[scrollKey],
        calcDataRef.current.map(({ idxRange }) => idxRange)
      );

      if (idx !== prevIdx) {
        updateItems(idx);
        prevIdx = idx;
      }
    };

    outer!.addEventListener("scroll", scrollHandler);

    return () => outer!.removeEventListener("scroll", scrollHandler);
  }, [getCalcData, getTotalSize, itemCount, scrollKey, updateItems]);

  return { outerRef, innerRef, items };
};

export default useVirtual;
