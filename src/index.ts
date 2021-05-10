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

const useVirtual = <
  O extends HTMLElement = HTMLElement,
  I extends HTMLElement = HTMLElement,
  D extends Data = Data
>({
  itemData,
  itemCount,
  itemSize,
  defaultItemSize = 50,
  isHorizontal,
  overscanCount = 2,
}: Config<D>): Return<O, I, D> => {
  const [items, setItems] = useState<Item<D>[]>([]);
  const hasWarn = useRef(false);
  const idxRef = useRef(0);
  const outerRef = useRef<O>(null);
  const innerRef = useRef<I>(null);
  const itemDataRef = useRef<D[] | undefined>(itemData);
  const outerSizeRef = useRef(0);
  const totalSizeRef = useRef(0);
  const calcDataRef = useRef<CalcData[]>([]);
  const measureSizesRef = useRef<number[]>([]);
  const itemSizeRef = useLatest<ItemSize>(itemSize);
  const sizeKey = !isHorizontal ? "height" : "width";
  const marginKey = !isHorizontal ? "marginTop" : "marginLeft";
  const scrollKey = !isHorizontal ? "scrollTop" : "scrollLeft";
  itemCount = itemCount !== undefined ? itemCount : itemData?.length;

  if (overscanCount < 1) {
    if (!hasWarn.current) {
      warn("Fallback to 1");
      hasWarn.current = true;
    }

    overscanCount = 1;
  }

  const getItemSize = useCallback(
    (idx: number) => {
      if (measureSizesRef.current[idx] !== undefined)
        return measureSizesRef.current[idx];

      let { current: itemSz } = itemSizeRef;
      itemSz = typeof itemSz === "function" ? itemSz(idx) : itemSz;

      return itemSz ?? defaultItemSize;
    },
    [defaultItemSize, itemSizeRef]
  );

  const getTotalSize = useCallback(() => {
    if (!itemCount) return 0;

    let size = 0;

    for (let i = 0; i < itemCount; i += 1) size += getItemSize(i);

    return size;
  }, [getItemSize, itemCount]);

  const getDisplayCount = useCallback(
    (idx: number) => {
      if (!itemCount) return 0;

      if (typeof itemSizeRef.current === "number")
        return outerSizeRef.current / itemSizeRef.current;

      let size = outerSizeRef.current;
      let count = 0;

      while (size > 0 && idx < itemCount) {
        size -= getItemSize(idx);
        count += 1;
        idx += 1;
      }

      return count;
    },
    [getItemSize, itemCount, itemSizeRef]
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

      const nextItems: Item<D>[] = [];
      let shouldRecalc = false;

      for (let i = start; i < end; i += 1)
        nextItems.push({
          data: itemDataRef.current ? itemDataRef.current[i] : undefined,
          index: i,
          size: getItemSize(i),
          // eslint-disable-next-line no-loop-func
          measureRef: (el) => {
            if (!el) return;

            const size = el.getBoundingClientRect()[sizeKey];

            if (size !== getItemSize(i)) {
              measureSizesRef.current[i] = size;
              shouldRecalc = true;
            }

            if (i === end - 1 && shouldRecalc) {
              totalSizeRef.current = getTotalSize();
              calcDataRef.current = getCalcData();
            }
          },
        });

      setItems(nextItems);
    },
    [getCalcData, getItemSize, getTotalSize, marginKey, sizeKey]
  );

  useResizeObserver<O>(outerRef, (rect) => {
    outerSizeRef.current = rect[sizeKey];
    totalSizeRef.current = getTotalSize();
    calcDataRef.current = getCalcData();

    updateItems(idxRef.current);
  });

  useLayoutEffect(() => {
    const { current: outer } = outerRef;

    invariant(!outer, "Outer error");
    invariant(!innerRef.current, "Inner error");
    invariant(itemCount === undefined, "Item count error");

    const scrollHandler = ({ target }: Event) => {
      const idx = findNearestBinarySearch(
        0,
        calcDataRef.current.length,
        (target as O)[scrollKey],
        calcDataRef.current.map(({ idxRange }) => idxRange)
      );

      if (idx !== idxRef.current) {
        updateItems(idx);
        idxRef.current = idx;
      }
    };

    outer!.addEventListener("scroll", scrollHandler);

    return () => outer!.removeEventListener("scroll", scrollHandler);
  }, [itemCount, scrollKey, updateItems]);

  return { outerRef, innerRef, items };
};

export default useVirtual;
