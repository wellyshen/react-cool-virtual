import { useCallback, useRef, useState } from "react";

import {
  Align,
  Item,
  ItemData,
  ItemSize,
  Measure,
  Options,
  Return,
  ScrollTo,
  ScrollToOptions,
  ScrollToItem,
  ScrollToItemOptions,
  SsrItemCount,
} from "./types";
import {
  easeInOutCubic,
  findNearestBinarySearch,
  isNumber,
  now,
  shouldUpdate,
  useDebounce,
  useIsoLayoutEffect,
  useLatest,
  useResizeEffect,
} from "./utils";

const DEFAULT_ITEM_SIZE = 50;
const DEBOUNCE_INTERVAL = 150;

const getInitItems = (itemSize: ItemSize, ssrItemCount?: SsrItemCount) => {
  if (!ssrItemCount) return [];

  const [idx, len] = isNumber(ssrItemCount)
    ? [0, ssrItemCount - 1]
    : ssrItemCount;
  const ssrItems = [];

  for (let i = idx; i <= len; i += 1)
    ssrItems[i] = {
      index: i,
      start: 0,
      width: 0,
      size: isNumber(itemSize) ? itemSize : itemSize(i, 0) ?? DEFAULT_ITEM_SIZE,
      measureRef: () => null,
    };

  return ssrItems;
};

export default <
  O extends HTMLElement = HTMLElement,
  I extends HTMLElement = HTMLElement
>({
  itemCount,
  ssrItemCount,
  itemSize = DEFAULT_ITEM_SIZE,
  horizontal,
  overscanCount = 1,
  useIsScrolling,
  scrollDuration = 500,
  scrollEasingFunction = easeInOutCubic,
  loadMoreCount = 15,
  isItemLoaded,
  loadMore,
  onScroll,
  onResize,
}: Options): Return<O, I> => {
  const [items, setItems] = useState<Item[]>(() =>
    getInitItems(itemSize, ssrItemCount)
  );
  const hasDynamicSizeRef = useRef(false);
  const hasLoadMoreOnMountRef = useRef(false);
  const roRef = useRef<ResizeObserver>();
  const itemDataRef = useRef<ItemData>(new Map());
  const scrollOffsetRef = useRef(0);
  const prevMeasureIdxRef = useRef(-1);
  const prevVStopRef = useRef<number>();
  const outerRef = useRef<O>(null);
  const innerRef = useRef<I>(null);
  const outerRectRef = useRef({ width: 0, height: 0 });
  const msDataRef = useRef<Measure[]>([]);
  const userScrollRef = useRef(true);
  const scrollToRafRef = useRef<number>();
  const isItemLoadedRef = useRef(isItemLoaded);
  const loadMoreRef = useLatest(loadMore);
  const easingFnRef = useLatest(scrollEasingFunction);
  const itemSizeRef = useLatest(itemSize);
  const useIsScrollingRef = useLatest(useIsScrolling);
  const onScrollRef = useLatest(onScroll);
  const onResizeRef = useLatest(onResize);
  const sizeKey = !horizontal ? "height" : "width";
  const marginKey = !horizontal ? "marginTop" : "marginLeft";
  const scrollKey = !horizontal ? "scrollTop" : "scrollLeft";

  const getItemSize = useCallback(
    (idx: number) => {
      const { current: size } = itemSizeRef;
      return isNumber(size)
        ? size
        : size(idx, outerRectRef.current.width) ?? DEFAULT_ITEM_SIZE;
    },
    [itemSizeRef]
  );

  const getMeasure = useCallback((idx: number, size: number): Measure => {
    const start = msDataRef.current[idx - 1]?.end || 0;
    return { idx, start, end: start + size, size };
  }, []);

  const measureItems = useCallback(
    (useCache = true) => {
      for (let i = 0; i < itemCount; i += 1)
        msDataRef.current[i] = getMeasure(
          i,
          useCache && msDataRef.current[i]
            ? msDataRef.current[i].size
            : getItemSize(i)
        );
    },
    [getItemSize, getMeasure, itemCount]
  );

  const getCalcData = useCallback(
    (scrollOffset: number) => {
      const { current: msData } = msDataRef;
      let vStart = 0;

      if (hasDynamicSizeRef.current) {
        while (
          vStart < msData.length &&
          msData[vStart].start < (msData[vStart + 1]?.start || 0) &&
          msData[vStart].start < scrollOffset
        )
          vStart += 1;
      } else {
        vStart = findNearestBinarySearch(
          0,
          msData.length - 1,
          scrollOffset,
          (idx) => msData[idx].start
        );
      }

      let vStop = vStart;
      let currStart = msData[vStop].start;

      while (
        vStop < msData.length &&
        currStart < scrollOffset + outerRectRef.current[sizeKey]
      ) {
        vStop += 1;
        currStart += msData[vStop]?.size || 0;
      }

      const oStart = Math.max(vStart - overscanCount, 0);
      const margin = msData[oStart].start;

      return {
        oStart,
        oStop: Math.min(vStop + overscanCount, msData.length) - 1,
        vStart,
        vStop: vStop - 1,
        margin,
        innerSize: msData[msData.length - 1].end - margin,
      };
    },
    [overscanCount, sizeKey]
  );

  const scrollTo = useCallback<ScrollTo>(
    (val, cb) => {
      if (!outerRef.current) return;

      const { current: prevOffset } = scrollOffsetRef;
      const { offset, smooth }: ScrollToOptions = isNumber(val)
        ? { offset: val }
        : val;

      if (!isNumber(offset) || offset === prevOffset) {
        if (cb) cb();
        return;
      }

      userScrollRef.current = false;

      if (!smooth) {
        outerRef.current[scrollKey] = offset;
        if (cb) cb();
        return;
      }

      const start = now();
      const scroll = () => {
        const time = Math.min((now() - start) / scrollDuration, 1);

        outerRef.current![scrollKey] =
          easingFnRef.current(time) * (offset - prevOffset) + prevOffset;

        if (time < 1) {
          scrollToRafRef.current = requestAnimationFrame(scroll);
        } else if (cb) {
          cb();
        }
      };

      scrollToRafRef.current = requestAnimationFrame(scroll);
    },
    [easingFnRef, scrollDuration, scrollKey]
  );

  const scrollToItem = useCallback<ScrollToItem>(
    (val, cb) => {
      const {
        index,
        align = Align.auto,
        smooth,
      }: ScrollToItemOptions = isNumber(val) ? { index: val } : val;

      if (!isNumber(index)) return;

      if (hasDynamicSizeRef.current) measureItems();

      const ms = msDataRef.current[Math.max(0, Math.min(index, itemCount - 1))];

      if (!ms) return;

      const { start, end, size } = ms;
      let { current: scrollOffset } = scrollOffsetRef;
      const outerSize = outerRectRef.current[sizeKey];
      const endPos = start - outerSize + size;

      switch (align) {
        case Align.start:
          scrollOffset = start;
          break;
        case Align.center:
          scrollOffset = start - outerSize / 2 + size / 2;
          break;
        case Align.end:
          scrollOffset = endPos;
          break;
        default:
          if (scrollOffset > start) {
            scrollOffset = start;
          } else if (scrollOffset + outerSize < end) {
            scrollOffset = endPos;
          }
      }

      if (
        hasDynamicSizeRef.current &&
        Math.abs(scrollOffset - scrollOffsetRef.current) <= 1
      ) {
        if (cb) cb();
        return;
      }

      scrollTo({ offset: scrollOffset, smooth }, () => {
        if (!hasDynamicSizeRef.current) {
          if (cb) cb();
        } else {
          setTimeout(() => scrollToItem(val, cb));
        }
      });
    },
    [itemCount, measureItems, scrollTo, sizeKey]
  );

  const [resetIsScrolling, cancelResetIsScrolling] = useDebounce(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    () => handleScroll(scrollOffsetRef.current),
    DEBOUNCE_INTERVAL
  );

  const [resetOthers, cancelResetOthers] = useDebounce(() => {
    userScrollRef.current = true;

    const len = itemDataRef.current.size - items.length;
    const iter = itemDataRef.current[Symbol.iterator]();
    for (let i = 0; i < len; i += 1)
      itemDataRef.current.delete(iter.next().value[0]);
  }, DEBOUNCE_INTERVAL);

  const handleScroll = useCallback(
    (scrollOffset: number, isScrolling?: boolean, uxScrolling?: boolean) => {
      if (!innerRef.current) return;

      if (
        loadMoreRef.current &&
        !hasLoadMoreOnMountRef.current &&
        !(isItemLoadedRef.current && isItemLoadedRef.current(0))
      )
        loadMoreRef.current({
          startIndex: 0,
          stopIndex: loadMoreCount - 1,
          loadIndex: 0,
          scrollOffset,
          userScroll: userScrollRef.current,
        });

      hasLoadMoreOnMountRef.current = true;

      if (!itemCount) {
        setItems([]);
        return;
      }

      const { oStart, oStop, vStart, vStop, margin, innerSize } =
        getCalcData(scrollOffset);

      innerRef.current.style[marginKey] = `${margin}px`;
      innerRef.current.style[sizeKey] = `${innerSize}px`;

      const nextItems: Item[] = [];

      for (let i = oStart; i <= oStop; i += 1)
        nextItems.push({
          index: i,
          start: msDataRef.current[i].start - margin,
          size: msDataRef.current[i].size,
          width: outerRectRef.current.width,
          isScrolling: uxScrolling || undefined,
          measureRef: (el) => {
            if (!el) return;

            if (itemDataRef.current.get(el)) {
              itemDataRef.current.delete(el);
              roRef.current?.unobserve(el);
            }

            itemDataRef.current.set(el, {
              idx: i,
              scrollOffset,
              isScrolling,
              uxScrolling,
            });
            roRef.current?.observe(el);
          },
        });

      setItems((prevItems) =>
        shouldUpdate(prevItems, nextItems, { measureRef: true })
          ? nextItems
          : prevItems
      );

      if (!isScrolling) return;

      if (onScrollRef.current)
        onScrollRef.current({
          overscanStartIndex: oStart,
          overscanStopIndex: oStop,
          visibleStartIndex: vStart,
          visibleStopIndex: vStop,
          scrollOffset,
          scrollForward: scrollOffset > scrollOffsetRef.current,
          userScroll: userScrollRef.current,
        });

      const loadIndex = Math.floor((vStop + 1) / loadMoreCount);
      const startIndex = loadIndex * loadMoreCount;

      if (
        loadMoreRef.current &&
        vStop !== prevVStopRef.current &&
        !(isItemLoadedRef.current && isItemLoadedRef.current(loadIndex))
      )
        loadMoreRef.current({
          startIndex,
          stopIndex: startIndex + loadMoreCount - 1,
          loadIndex,
          scrollOffset,
          userScroll: userScrollRef.current,
        });

      prevVStopRef.current = vStop;

      if (uxScrolling) resetIsScrolling();
      resetOthers();
    },
    [
      getCalcData,
      itemCount,
      loadMoreCount,
      loadMoreRef,
      marginKey,
      onScrollRef,
      resetIsScrolling,
      resetOthers,
      sizeKey,
    ]
  );

  useResizeEffect<O>(
    outerRef,
    (rect) => {
      const isSameWidth = outerRectRef.current.width === rect.width;
      const prevTotalSize =
        msDataRef.current[msDataRef.current.length - 1]?.end;

      outerRectRef.current = rect;
      measureItems(hasDynamicSizeRef.current || isSameWidth);
      handleScroll(scrollOffsetRef.current);

      if (onResizeRef.current) onResizeRef.current(rect);

      if (hasDynamicSizeRef.current || isSameWidth) return;

      const totalSize = msDataRef.current[msDataRef.current.length - 1]?.end;
      const ratio = totalSize / prevTotalSize;

      if (ratio) scrollTo(scrollOffsetRef.current * ratio);
    },
    [itemCount, handleScroll, measureItems, onResizeRef, scrollTo]
  );

  useIsoLayoutEffect(() => {
    const { current: outer } = outerRef;

    if (!outer) return () => null;

    const scrollHandler = ({ target }: Event) => {
      const scrollOffset = (target as O)[scrollKey];
      let { current: uxScrolling } = useIsScrollingRef;
      uxScrolling =
        typeof uxScrolling === "function"
          ? uxScrolling(Math.abs(scrollOffset - scrollOffsetRef.current))
          : uxScrolling;

      handleScroll(scrollOffset, true, uxScrolling);
      scrollOffsetRef.current = scrollOffset;
    };

    outer.addEventListener("scroll", scrollHandler, { passive: true });

    // eslint-disable-next-line compat/compat
    roRef.current = new ResizeObserver((entries, ro) =>
      entries.forEach(({ target }) => {
        // NOTE: Use `borderBoxSize` when it's supported by Safari
        // see: https://caniuse.com/mdn-api_resizeobserverentry_borderboxsize
        const measuredSize = target.getBoundingClientRect()[sizeKey];

        if (!measuredSize) {
          ro.unobserve(target);
          return;
        }

        const { idx, scrollOffset, isScrolling, uxScrolling } =
          itemDataRef.current.get(target)!;
        const { start, size } = msDataRef.current[idx];
        const prevEnd = msDataRef.current[idx - 1]?.end || 0;

        if (measuredSize !== size || start !== prevEnd) {
          if (idx < prevMeasureIdxRef.current && start < scrollOffset)
            scrollTo(scrollOffset + measuredSize - size);

          msDataRef.current[idx] = getMeasure(idx, measuredSize);
          handleScroll(scrollOffset, isScrolling, uxScrolling);

          hasDynamicSizeRef.current = true;
        }

        prevMeasureIdxRef.current = idx;
      })
    );

    const itemData = itemDataRef.current;

    return () => {
      cancelResetIsScrolling();
      cancelResetOthers();
      if (scrollToRafRef.current) {
        cancelAnimationFrame(scrollToRafRef.current);
        scrollToRafRef.current = undefined;
      }

      outer.removeEventListener("scroll", scrollHandler);
      roRef.current?.disconnect();

      itemData.clear();
    };
  }, [
    cancelResetIsScrolling,
    cancelResetOthers,
    getMeasure,
    handleScroll,
    scrollKey,
    scrollTo,
    sizeKey,
    useIsScrollingRef,
  ]);

  return { outerRef, innerRef, items, scrollTo, scrollToItem };
};
