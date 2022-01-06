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
  State,
} from "./types";
import {
  findNearestBinarySearch,
  isNumber,
  now,
  shouldUpdate,
  useDebounce,
  useIsoLayoutEffect,
  useLatest,
  useResizeEffect,
} from "./utils";

const getInitState = (itemSize: ItemSize, ssrItemCount: SsrItemCount = 0) => {
  const [idx, len] = isNumber(ssrItemCount)
    ? [0, ssrItemCount - 1]
    : ssrItemCount;
  const items = [];

  for (let i = idx; i <= len; i += 1)
    items.push({
      index: i,
      start: 0,
      width: 0,
      size: isNumber(itemSize) ? itemSize : itemSize(i, 0),
      measureRef: /* istanbul ignore next */ () => null,
    });

  return { items };
};

export default <
  O extends HTMLElement = HTMLElement,
  I extends HTMLElement = O
>({
  itemCount,
  ssrItemCount,
  itemSize = 50,
  horizontal,
  resetScroll,
  overscanCount = 1,
  useIsScrolling,
  stickyIndices,
  // Default = 100ms <= distance * 0.75 <= 500ms
  scrollDuration = (d) => Math.min(Math.max(d * 0.075, 100), 500),
  // Default = easeInOutSine
  scrollEasingFunction = (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  loadMoreCount = 15,
  isItemLoaded,
  loadMore,
  onScroll,
  onResize,
}: Options): Return<O, I> => {
  const [state, setState] = useState<State>(() =>
    getInitState(itemSize, ssrItemCount)
  );
  const isMountedRef = useRef(false);
  const isScrollingRef = useRef(true);
  const isScrollToItemRef = useRef(false);
  const hasDynamicSizeRef = useRef(false);
  const rosRef = useRef<Map<Element, ResizeObserver>>(new Map());
  const scrollOffsetRef = useRef(0);
  const prevItemIdxRef = useRef(-1);
  const prevVStopRef = useRef(-1);
  const outerRef = useRef<O>(null);
  const innerRef = useRef<I>(null);
  const outerRectRef = useRef({ width: 0, height: 0 });
  const msDataRef = useRef<Measure[]>([]);
  const userScrollRef = useRef(true);
  const scrollToRafRef = useRef<number>();
  const stickyIndicesRef = useLatest(stickyIndices);
  const durationRef = useLatest(scrollDuration);
  const easingFnRef = useLatest(scrollEasingFunction);
  const isItemLoadedRef = useRef(isItemLoaded);
  const loadMoreRef = useLatest(loadMore);
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
      return isNumber(size) ? size : size(idx, outerRectRef.current.width);
    },
    [itemSizeRef]
  );

  const getMeasure = useCallback((idx: number, size: number): Measure => {
    const start = msDataRef.current[idx - 1]?.end ?? 0;
    return { idx, start, end: start + size, size };
  }, []);

  const measureItems = useCallback(
    (useCache = true) => {
      msDataRef.current.length = itemCount;

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
      const lastIdx = msData.length - 1;
      let vStart = 0;

      if (hasDynamicSizeRef.current) {
        while (
          vStart < lastIdx &&
          msData[vStart].start + msData[vStart].size < scrollOffset
        )
          vStart += 1;
      } else {
        vStart = findNearestBinarySearch(
          0,
          lastIdx,
          scrollOffset,
          (idx) => msData[idx].start
        );
      }

      let vStop = vStart;
      let currStart = msData[vStop].start;

      while (
        vStop < lastIdx &&
        currStart < scrollOffset + outerRectRef.current[sizeKey]
      ) {
        currStart += msData[vStop].size;
        vStop += 1;
      }

      vStop = vStop === lastIdx ? vStop : vStop - 1;
      const oStart = Math.max(vStart - overscanCount, 0);
      const oStop = Math.min(vStop + overscanCount, lastIdx);
      const innerMargin = msData[oStart].start;
      const totalSize = Math[oStop < lastIdx ? "max" : "min"](
        msData[oStop].end + msData[oStop].size,
        msData[lastIdx].end
      );

      return {
        oStart,
        oStop,
        vStart,
        vStop,
        innerMargin,
        innerSize: totalSize - innerMargin,
      };
    },
    [overscanCount, sizeKey]
  );

  const scrollTo = useCallback(
    (offset: number, isScrolling = true) => {
      if (outerRef.current) {
        isScrollingRef.current = isScrolling;
        outerRef.current[scrollKey] = offset;
      }
    },
    [scrollKey]
  );

  const scrollToOffset = useCallback<ScrollTo>(
    (val, cb) => {
      const { offset, smooth }: ScrollToOptions = isNumber(val)
        ? { offset: val }
        : val;

      if (!isNumber(offset)) return;

      userScrollRef.current = false;

      if (!smooth) {
        scrollTo(offset);
        if (cb) cb();

        return;
      }

      const { current: prevOffset } = scrollOffsetRef;
      const start = now();

      const scroll = () => {
        let { current: duration } = durationRef;
        duration = isNumber(duration)
          ? duration
          : duration(Math.abs(offset - prevOffset));
        const time = Math.min((now() - start) / duration, 1);
        const easing = easingFnRef.current(time);

        scrollTo(easing * (offset - prevOffset) + prevOffset);

        if (time < 1) {
          scrollToRafRef.current = requestAnimationFrame(scroll);
        } else if (cb) {
          cb();
        }
      };

      scrollToRafRef.current = requestAnimationFrame(scroll);
    },
    [durationRef, easingFnRef, scrollTo]
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

      // For dynamic size, we must measure it for getting the correct scroll position
      if (hasDynamicSizeRef.current) measureItems();

      const { current: msData } = msDataRef;
      const ms = msData[Math.max(0, Math.min(index, msData.length - 1))];

      if (!ms) return;

      const { start, end, size } = ms;
      const totalSize = msData[msData.length - 1].end;
      const outerSize = outerRectRef.current[sizeKey];
      let { current: scrollOffset } = scrollOffsetRef;

      if (totalSize <= outerSize) {
        if (cb) cb();
        return;
      }

      if (
        align === Align.start ||
        (align === Align.auto &&
          scrollOffset + outerSize > end &&
          scrollOffset > start)
      ) {
        scrollOffset =
          totalSize - start <= outerSize ? totalSize - outerSize : start;
      } else if (
        align === Align.end ||
        (align === Align.auto &&
          scrollOffset + outerSize < end &&
          scrollOffset < start)
      ) {
        scrollOffset = start + size <= outerSize ? 0 : start - outerSize + size;
      } else if (align === Align.center && start + size / 2 > outerSize / 2) {
        const to = start - outerSize / 2 + size / 2;
        scrollOffset = totalSize - to <= outerSize ? totalSize - outerSize : to;
      }

      if (
        hasDynamicSizeRef.current &&
        Math.abs(scrollOffset - scrollOffsetRef.current) <= 1
      ) {
        if (cb) cb();
        return;
      }

      scrollToOffset({ offset: scrollOffset, smooth }, () => {
        if (!hasDynamicSizeRef.current) {
          if (cb) cb();
        } else {
          setTimeout(() => scrollToItem(val, cb));
        }
      });
    },
    [measureItems, scrollToOffset, sizeKey]
  );

  const [resetIsScrolling, cancelResetIsScrolling] = useDebounce(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    () => handleScroll(scrollOffsetRef.current),
    150
  );

  const handleScroll = useCallback(
    (scrollOffset: number, isScrolling?: boolean, uxScrolling?: boolean) => {
      if (
        loadMoreRef.current &&
        !isMountedRef.current &&
        !(isItemLoadedRef.current && isItemLoadedRef.current(0))
      )
        loadMoreRef.current({
          startIndex: 0,
          stopIndex: loadMoreCount - 1,
          loadIndex: 0,
          scrollOffset,
          userScroll: false,
        });

      if (!itemCount) {
        setState({ items: [] });
        return;
      }

      const calcData = getCalcData(scrollOffset);
      const { oStart, oStop, vStart, vStop } = calcData;
      let { innerMargin, innerSize } = calcData;
      const items: Item[] = [];
      const stickies = Array.isArray(stickyIndicesRef.current)
        ? stickyIndicesRef.current
        : [];

      for (let i = oStart; i <= oStop; i += 1) {
        const { current: msData } = msDataRef;
        const { start, size } = msData[i];

        items.push({
          index: i,
          start: start - innerMargin,
          size,
          width: outerRectRef.current.width,
          isScrolling: uxScrolling || undefined,
          isSticky: stickies.includes(i) || undefined,
          measureRef: (el) => {
            if (!el) return;

            // eslint-disable-next-line compat/compat
            new ResizeObserver(([{ target }], ro) => {
              // NOTE: Use `borderBoxSize` when it's supported by Safari
              // see: https://caniuse.com/mdn-api_resizeobserverentry_borderboxsize
              const measuredSize = target.getBoundingClientRect()[sizeKey];

              if (!measuredSize) {
                ro.disconnect();
                rosRef.current.delete(target);
                return;
              }

              const prevEnd = msData[i - 1]?.end ?? 0;

              if (measuredSize !== size || start !== prevEnd) {
                // To prevent dynamic size from jumping during backward scrolling
                if (i < prevItemIdxRef.current && start < scrollOffset)
                  scrollTo(scrollOffset + measuredSize - size, false);

                msDataRef.current[i] = getMeasure(i, measuredSize);
                if (!isScrollToItemRef.current)
                  handleScroll(
                    scrollOffsetRef.current,
                    isScrolling,
                    uxScrolling
                  );

                hasDynamicSizeRef.current = true;
              }

              prevItemIdxRef.current = i;

              rosRef.current.get(target)?.disconnect();
              rosRef.current.set(target, ro);
            }).observe(el);
          },
        });
      }

      if (stickies.length) {
        const stickyIdx =
          stickies[
            findNearestBinarySearch(
              0,
              stickies.length - 1,
              vStart,
              (idx) => stickies[idx]
            )
          ];

        if (oStart > stickyIdx) {
          const { size } = msDataRef.current[stickyIdx];

          items.unshift({
            index: stickyIdx,
            start: 0,
            size,
            width: outerRectRef.current.width,
            isScrolling: uxScrolling || undefined,
            isSticky: true,
            measureRef: /* istanbul ignore next */ () => null,
          });

          innerMargin -= size;
          innerSize += size;
        }
      }

      setState((prevState) =>
        shouldUpdate(prevState.items, items, { measureRef: true })
          ? { items, innerMargin, innerSize }
          : prevState
      );

      if (!isScrolling) return;

      const scrollForward = scrollOffset > scrollOffsetRef.current;

      if (onScrollRef.current)
        onScrollRef.current({
          overscanStartIndex: oStart,
          overscanStopIndex: oStop,
          visibleStartIndex: vStart,
          visibleStopIndex: vStop,
          scrollOffset,
          scrollForward,
          userScroll: userScrollRef.current,
        });

      const loadIndex = Math.max(
        Math.floor((vStop + 1) / loadMoreCount) - (scrollForward ? 0 : 1),
        0
      );
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

      if (uxScrolling) resetIsScrolling();

      prevVStopRef.current = vStop;
    },
    [
      stickyIndicesRef,
      getCalcData,
      getMeasure,
      itemCount,
      loadMoreCount,
      loadMoreRef,
      onScrollRef,
      resetIsScrolling,
      scrollTo,
      sizeKey,
    ]
  );

  useResizeEffect<O>(
    outerRef,
    (rect) => {
      const { width, height } = outerRectRef.current;
      const isSameWidth = width === rect.width;
      const isSameSize = isSameWidth && height === rect.height;
      const msDataLen = msDataRef.current.length;
      const prevTotalSize = msDataRef.current[msDataLen - 1]?.end;

      outerRectRef.current = rect;
      measureItems(hasDynamicSizeRef.current);
      handleScroll(scrollOffsetRef.current);

      if (resetScroll && itemCount !== msDataLen)
        setTimeout(() => scrollTo(0, false));

      if (!isMountedRef.current) {
        isMountedRef.current = true;
        return;
      }

      if (!hasDynamicSizeRef.current && !isSameWidth) {
        const totalSize = msDataRef.current[msDataRef.current.length - 1]?.end;
        const ratio = totalSize / prevTotalSize || 1;

        scrollTo(scrollOffsetRef.current * ratio, false);
      }

      if (!isSameSize && onResizeRef.current) onResizeRef.current(rect);
    },
    [itemCount, resetScroll, handleScroll, measureItems, onResizeRef, scrollTo]
  );

  useIsoLayoutEffect(() => {
    if (!innerRef.current) return;

    if (isNumber(state.innerMargin))
      innerRef.current.style[marginKey] = `${state.innerMargin}px`;
    if (isNumber(state.innerSize))
      innerRef.current.style[sizeKey] = `${state.innerSize}px`;
  }, [marginKey, sizeKey, state.innerMargin, state.innerSize]);

  useIsoLayoutEffect(() => {
    const { current: outer } = outerRef;

    if (!outer) return () => null;

    const scrollHandler = ({ target }: Event) => {
      const scrollOffset = (target as O)[scrollKey];

      if (scrollOffset === scrollOffsetRef.current) return;

      let { current: uxScrolling } = useIsScrollingRef;
      uxScrolling =
        typeof uxScrolling === "function"
          ? uxScrolling(Math.abs(scrollOffset - scrollOffsetRef.current))
          : uxScrolling;

      handleScroll(scrollOffset, isScrollingRef.current, uxScrolling);

      userScrollRef.current = true;
      isScrollingRef.current = true;
      isScrollToItemRef.current = false;
      scrollOffsetRef.current = scrollOffset;
    };

    outer.addEventListener("scroll", scrollHandler, { passive: true });

    const ros = rosRef.current;

    return () => {
      cancelResetIsScrolling();
      if (scrollToRafRef.current) {
        cancelAnimationFrame(scrollToRafRef.current);
        scrollToRafRef.current = undefined;
      }

      outer.removeEventListener("scroll", scrollHandler);

      ros.forEach((ro) => ro.disconnect());
      ros.clear();
    };
  }, [cancelResetIsScrolling, handleScroll, scrollKey, useIsScrollingRef]);

  return {
    outerRef,
    innerRef,
    items: state.items,
    scrollTo: scrollToOffset,
    scrollToItem,
  };
};
