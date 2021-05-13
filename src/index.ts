import { useCallback, useRef, useState, useLayoutEffect } from "react";

import {
  Data,
  Item,
  ItemSize,
  Measure,
  OnScroll,
  Options,
  Return,
} from "./types";
import {
  createIndexes,
  findNearestBinarySearch,
  invariant,
  // useIsoLayoutEffect,
  useLatest,
  useResizeObserver,
} from "./utils";

const DEFAULT_ITEM_SIZE = 50;

const useVirtual = <
  O extends HTMLElement = HTMLElement,
  I extends HTMLElement = HTMLElement,
  D extends Data = Data
>({
  itemData,
  itemCount,
  itemSize,
  defaultItemSize = DEFAULT_ITEM_SIZE,
  horizontal,
  overscanCount = 1,
  onScroll,
}: Options<D>): Return<O, I, D> => {
  const [items, setItems] = useState<Item<D>[]>([]);
  const offsetRef = useRef(0);
  const outerRef = useRef<O>(null);
  const innerRef = useRef<I>(null);
  const itemDataRef = useRef<D[] | undefined>(itemData);
  const outerSizeRef = useRef(0);
  const measuresRef = useRef<Measure[]>([]);
  const itemSizeRef = useLatest<ItemSize>(itemSize);
  const onScrollRef = useLatest<OnScroll | undefined>(onScroll);
  const sizeKey = !horizontal ? "height" : "width";
  const marginKey = !horizontal ? "marginTop" : "marginLeft";
  const scrollKey = !horizontal ? "scrollTop" : "scrollLeft";
  const directionDR = !horizontal ? "down" : "right";
  const directionUL = !horizontal ? "up" : "left";
  itemCount = itemCount !== undefined ? itemCount : itemData?.length;

  const getItemSize = useCallback(
    (idx: number) => {
      if (measuresRef.current[idx]) return measuresRef.current[idx].size;

      let { current: size } = itemSizeRef;
      size = typeof size === "function" ? size(idx) : size;

      return size ?? defaultItemSize ?? DEFAULT_ITEM_SIZE;
    },
    [defaultItemSize, itemSizeRef]
  );

  const getMeasures = useCallback(() => {
    if (!itemCount) return [];

    const measures: Measure[] = [];

    for (let i = 0; i < itemCount; i += 1) {
      const start = i ? measures[i - 1].end : 0;
      const size = getItemSize(i);

      measures.push({ start, end: start + size, size });
    }

    return measures;
  }, [getItemSize, itemCount]);

  const getCalcData = useCallback(
    (offset: number) => {
      const { current: measures } = measuresRef;
      const startIdx = findNearestBinarySearch(
        0,
        measures.length,
        offset,
        measuresRef.current.map(({ start }) => start)
      );
      let endIdx = startIdx;

      while (
        endIdx < measures.length &&
        measures[endIdx].start < offset + outerSizeRef.current
      )
        endIdx += 1;

      const start = Math.max(startIdx - overscanCount, 0);
      const margin = measures[start].start;

      return {
        startIdx,
        endIdx: endIdx - 1,
        start,
        end: Math.min(endIdx + overscanCount, measures.length) - 1,
        margin,
        innerSize: measures[measures.length - 1].end - margin,
      };
    },
    [overscanCount]
  );

  const updateItems = useCallback(
    (
      offset: number,
      {
        onScrollFn = onScrollRef.current,
        userScroll = true,
      }: { onScrollFn?: OnScroll | false; userScroll?: boolean } = {}
    ) => {
      const { current: inner } = innerRef;

      if (!inner) return;

      const { startIdx, endIdx, start, end, margin, innerSize } =
        getCalcData(offset);

      inner.style[marginKey] = `${margin}px`;
      inner.style[sizeKey] = `${innerSize}px`;

      const nextItems: Item<D>[] = [];
      let shouldRecalc = false;

      for (let i = start; i <= end; i += 1)
        nextItems.push({
          data: itemDataRef.current ? itemDataRef.current[i] : undefined,
          index: i,
          size: measuresRef.current[i].size,
          outerSize: outerSizeRef.current,
          // eslint-disable-next-line no-loop-func
          measureRef: (el) => {
            if (!el) return;

            const { [sizeKey]: size } = el.getBoundingClientRect();

            if (size !== measuresRef.current[i].size) {
              measuresRef.current[i].size = size;
              shouldRecalc = true;
            }

            if (i === end && shouldRecalc) {
              measuresRef.current = getMeasures();
              updateItems(offset, { onScrollFn, userScroll });
            }
          },
        });

      setItems(nextItems);

      if (onScrollFn)
        onScrollFn({
          overscanIndexes: createIndexes(start, end),
          itemIndexes: createIndexes(startIdx, endIdx),
          offset,
          direction: offset > offsetRef.current ? directionDR : directionUL,
          userScroll,
        });

      offsetRef.current = offset;
    },
    [
      directionDR,
      directionUL,
      getCalcData,
      getMeasures,
      marginKey,
      onScrollRef,
      sizeKey,
    ]
  );

  useResizeObserver<O>(outerRef, (rect) => {
    outerSizeRef.current = rect[sizeKey];
    measuresRef.current = getMeasures();

    updateItems(offsetRef.current, { onScrollFn: false });
  });

  useLayoutEffect(() => {
    const { current: outer } = outerRef;

    invariant(!outer, "Outer error");
    invariant(!innerRef.current, "Inner error");
    invariant(itemCount === undefined, "Item count error");

    const handleScroll = ({ target }: Event) =>
      updateItems((target as O)[scrollKey]);

    outer!.addEventListener("scroll", handleScroll);

    return () => outer!.removeEventListener("scroll", handleScroll);
  }, [itemCount, scrollKey, updateItems]);

  return { outerRef, innerRef, items };
};

export default useVirtual;
