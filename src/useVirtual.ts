import { useCallback, useRef, useState } from "react";

import {
  Align,
  Item,
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
const MAX_CORRECT_SCROLL_COUNT = 10;

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
      size: isNumber(itemSize) ? itemSize : itemSize(i, 0),
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
  loadMoreThreshold = 15,
  isItemLoaded,
  loadMore,
  onScroll,
  onResize,
}: Options): Return<O, I> => {
  const [items, setItems] = useState<Item[]>(() =>
    getInitItems(itemSize, ssrItemCount)
  );
  const hasDynamicSizeRef = useRef(false);
  const isScrollToItemRef = useRef(false);
  const hasLoadMoreOnMountRef = useRef(false);
  const correctScrollCountRef = useRef(0);
  const rosRef = useRef<Map<Element, ResizeObserver>>(new Map());
  const scrollOffsetRef = useRef(0);
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
      let { current: size } = itemSizeRef;
      size = isNumber(size) ? size : size(idx, outerRectRef.current.width);

      return size ?? DEFAULT_ITEM_SIZE;
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

      if (hasDynamicSizeRef.current && !isScrollToItemRef.current) {
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

      if (!isNumber(offset) || offset === prevOffset) return;

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

      isScrollToItemRef.current = true;

      if (hasDynamicSizeRef.current) measureItems();

      const ms = msDataRef.current[Math.max(0, Math.min(index, itemCount - 1))];

      if (!ms) return;

      const { start, end, size } = ms;
      let { current: scrollOffset } = scrollOffsetRef;
      const outerSize = outerRectRef.current[sizeKey];

      if (
        hasDynamicSizeRef.current &&
        scrollOffset <= start &&
        scrollOffset + outerSize >= end &&
        cb
      )
        cb();

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
          if (scrollOffset >= start) {
            scrollOffset = start;
          } else if (scrollOffset + outerSize <= end) {
            scrollOffset = endPos;
          }
      }

      scrollTo({ offset: scrollOffset, smooth }, () => {
        if (!hasDynamicSizeRef.current) {
          if (cb) cb();
        } else if (
          correctScrollCountRef.current <= MAX_CORRECT_SCROLL_COUNT &&
          (scrollOffset >= start || scrollOffset + outerSize <= end)
        ) {
          setTimeout(() => scrollToItem(val, cb));
          correctScrollCountRef.current += 1;
        } else {
          if (cb) cb();
          correctScrollCountRef.current = 0;
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
    isScrollToItemRef.current = false;
    userScrollRef.current = true;

    const len = rosRef.current.size - items.length;
    const iter = rosRef.current[Symbol.iterator]();
    for (let i = 0; i < len; i += 1)
      rosRef.current.delete(iter.next().value[0]);
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
          stopIndex: loadMoreThreshold - 1,
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

      for (let i = oStart; i <= oStop; i += 1) {
        const { current: msData } = msDataRef;
        const { start, size } = msData[i];

        nextItems.push({
          index: i,
          start: start - margin,
          size,
          width: outerRectRef.current.width,
          isScrolling: uxScrolling || undefined,
          measureRef: (el) => {
            if (!el) return;

            // eslint-disable-next-line compat/compat
            new ResizeObserver(([{ target }], ro) => {
              // NOTE: Use `borderBoxSize` when it's supported by Safari
              // see: https://caniuse.com/mdn-api_resizeobserverentry_borderboxsize
              const measuredSize = target.getBoundingClientRect()[sizeKey];

              if (!measuredSize) {
                ro.disconnect();
                return;
              }

              const prevEnd = msData[i - 1]?.end || 0;

              if (measuredSize !== size || start !== prevEnd) {
                if (isScrolling && start < scrollOffset)
                  scrollTo(scrollOffset + measuredSize - size);

                msDataRef.current[i] = getMeasure(i, measuredSize);
                handleScroll(scrollOffset, isScrolling, uxScrolling);

                hasDynamicSizeRef.current = true;
              }

              rosRef.current.get(target)?.disconnect();
              rosRef.current.set(target, ro);
            }).observe(el);
          },
        });
      }

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

      const loadIndex = Math.floor((vStop + 1) / loadMoreThreshold);
      const startIndex = loadIndex * loadMoreThreshold;

      if (
        loadMoreRef.current &&
        vStop !== prevVStopRef.current &&
        !(isItemLoadedRef.current && isItemLoadedRef.current(loadIndex))
      )
        loadMoreRef.current({
          startIndex,
          stopIndex: startIndex + loadMoreThreshold - 1,
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
      getMeasure,
      itemCount,
      loadMoreRef,
      loadMoreThreshold,
      marginKey,
      onScrollRef,
      resetIsScrolling,
      resetOthers,
      scrollTo,
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
      measureItems(isSameWidth);
      handleScroll(scrollOffsetRef.current);

      if (onResizeRef.current) onResizeRef.current(rect);

      const totalSize = msDataRef.current[msDataRef.current.length - 1]?.end;
      const ratio = !isSameWidth && totalSize / prevTotalSize;

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

    const ros = rosRef.current;

    return () => {
      cancelResetIsScrolling();
      cancelResetOthers();
      if (scrollToRafRef.current) {
        cancelAnimationFrame(scrollToRafRef.current);
        scrollToRafRef.current = undefined;
      }

      outer.removeEventListener("scroll", scrollHandler);

      ros.forEach((ro) => ro.disconnect());
      ros.clear();
    };
  }, [
    cancelResetIsScrolling,
    cancelResetOthers,
    handleScroll,
    scrollKey,
    useIsScrollingRef,
  ]);

  return { outerRef, innerRef, items, scrollTo, scrollToItem };
};
