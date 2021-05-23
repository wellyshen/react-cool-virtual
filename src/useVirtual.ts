import { useCallback, useRef, useState } from "react";

import {
  Align,
  Item,
  IsItemLoaded,
  ItemSize,
  KeyExtractor,
  LoadMore,
  Measure,
  OnScroll,
  Options,
  Return,
  ScrollEasingFunction,
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
  useAnimDebounce,
  useIsoLayoutEffect,
  useLatest,
  useResizeEffect,
} from "./utils";

const DEFAULT_ITEM_SIZE = 50;
const DEBOUNCE_INTERVAL = 200;
const AUTO_CORRECT_LIMIT = 10;

const getInitItems = (
  ssrItemCount?: SsrItemCount,
  keyExtractor?: KeyExtractor
) => {
  if (ssrItemCount === undefined) return [];

  const [idx, len] = isNumber(ssrItemCount)
    ? [0, ssrItemCount - 1]
    : ssrItemCount;
  const ssrItems = [];

  for (let i = idx; i <= len; i += 1) {
    const ssrItem = {
      index: i,
      start: 0,
      size: 0,
      width: 0,
      measureRef: () => null,
    };
    if (keyExtractor) (ssrItem as any).key = keyExtractor(i);
    ssrItems.push(ssrItem);
  }

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
  keyExtractor,
  onScroll,
  loadMoreThreshold = 15,
  isItemLoaded,
  loadMore,
}: Options): Return<O, I> => {
  const [items, setItems] = useState<Item[]>(() =>
    getInitItems(ssrItemCount, keyExtractor)
  );
  const hasLoadMoreOnMountRef = useRef(false);
  const autoCorrectTimesRef = useRef(0);
  const roQueueRef = useRef<ResizeObserver[]>([]);
  const vStopRef = useRef<number>();
  const offsetRef = useRef(0);
  const outerRef = useRef<O>(null);
  const innerRef = useRef<I>(null);
  const outerRectRef = useRef({ width: 0, height: 0 });
  const measuresRef = useRef<Measure[]>([]);
  const userScrollRef = useRef(true);
  const scrollRafRef = useRef<number>();
  const easingFnRef = useLatest<ScrollEasingFunction>(scrollEasingFunction);
  const keyExtractorRef = useLatest<KeyExtractor | undefined>(keyExtractor);
  const itemSizeRef = useLatest<ItemSize>(itemSize);
  const onScrollRef = useLatest<OnScroll | undefined>(onScroll);
  const isItemLoadedRef = useRef<IsItemLoaded | undefined>(isItemLoaded);
  const loadMoreRef = useLatest<LoadMore | undefined>(loadMore);
  const sizeKey = !horizontal ? "height" : "width";
  const itemSizeKey = !horizontal ? "blockSize" : "inlineSize";
  const marginKey = !horizontal ? "marginTop" : "marginLeft";
  const scrollKey = !horizontal ? "scrollTop" : "scrollLeft";

  const getItemSize = useCallback(
    (idx: number, skipCache: boolean) => {
      if (!skipCache && measuresRef.current[idx])
        return measuresRef.current[idx].size;

      let { current: size } = itemSizeRef;
      size = isNumber(size) ? size : size(idx, outerRectRef.current.width);

      return size ?? DEFAULT_ITEM_SIZE;
    },
    [itemSizeRef]
  );

  const getMeasures = useCallback(
    (skipCache = false) => {
      const measures: Measure[] = [];

      for (let i = 0; i < itemCount; i += 1) {
        const start = i ? measures[i - 1].end : 0;
        const size = getItemSize(i, skipCache);
        const measure: Measure = { idx: i, start, end: start + size, size };

        if (keyExtractorRef.current) measure.key = keyExtractorRef.current(i);

        measures.push(measure);
      }

      return measures;
    },
    [getItemSize, itemCount, keyExtractorRef]
  );

  const getCalcData = useCallback(
    (offset: number) => {
      const { current: measures } = measuresRef;
      const vStart = findNearestBinarySearch(
        0,
        measures.length,
        offset,
        measuresRef.current.map(({ start }) => start)
      );
      let vStop = vStart;

      while (
        vStop < measures.length &&
        measures[vStop].start < offset + outerRectRef.current[sizeKey]
      )
        vStop += 1;

      const oStart = Math.max(vStart - overscanCount, 0);
      const margin = measures[oStart].start;

      return {
        oStart,
        oStop: Math.min(vStop + overscanCount, measures.length) - 1,
        vStart,
        vStop: vStop - 1,
        margin,
        innerSize: measures[measures.length - 1].end - margin,
      };
    },
    [overscanCount, sizeKey]
  );

  const [resetIsScrolling, cancelResetIsScrolling] = useAnimDebounce(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    () => updateItems(offsetRef.current),
    DEBOUNCE_INTERVAL
  );

  const [resetUserScroll, cancelResetUserScroll] = useAnimDebounce(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    () => {
      userScrollRef.current = true;
    },
    DEBOUNCE_INTERVAL
  );

  const updateItems = useCallback(
    (offset: number, isScrolling = false) => {
      if (!innerRef.current) return;

      if (
        !hasLoadMoreOnMountRef.current &&
        loadMoreRef.current &&
        !(isItemLoadedRef.current && isItemLoadedRef.current(0))
      )
        loadMoreRef.current({
          startIndex: 0,
          stopIndex: loadMoreThreshold - 1,
          loadIndex: 0,
          scrollOffset: offset,
          userScroll: userScrollRef.current,
        });

      hasLoadMoreOnMountRef.current = true;

      if (!itemCount) {
        setItems([]);
        return;
      }

      const { oStart, oStop, vStart, vStop, margin, innerSize } =
        getCalcData(offset);

      innerRef.current.style[marginKey] = `${margin}px`;
      innerRef.current.style[sizeKey] = `${innerSize}px`;

      const nextItems: Item[] = [];

      for (let i = oStart; i <= oStop; i += 1) {
        const { key, start, size } = measuresRef.current[i];

        nextItems.push({
          key,
          index: i,
          start: start - margin,
          size,
          width: outerRectRef.current.width,
          isScrolling: useIsScrolling ? isScrolling : undefined,
          measureRef: (el) => {
            if (!el) return;

            while (roQueueRef.current.length > oStop - oStart) {
              let prevRo = roQueueRef.current.shift();
              prevRo?.disconnect();
              prevRo = undefined;
            }

            roQueueRef.current.push(
              // eslint-disable-next-line compat/compat
              new ResizeObserver(([{ borderBoxSize }]) => {
                const { [itemSizeKey]: measuredSize } = borderBoxSize[0];

                if (measuredSize && measuredSize !== size) {
                  measuresRef.current[i].size = measuredSize;
                  measuresRef.current = getMeasures();
                  updateItems(offset, isScrolling);
                }
              })
            );

            roQueueRef.current[roQueueRef.current.length - 1].observe(el);
          },
        });
      }

      setItems((prevItems) =>
        shouldUpdate(prevItems, nextItems, { measureRef: true })
          ? nextItems
          : prevItems
      );

      if (isScrolling) {
        if (onScrollRef.current)
          onScrollRef.current({
            overscanStartIndex: oStart,
            overscanStopIndex: oStop,
            visibleStartIndex: vStart,
            visibleStopIndex: vStop,
            scrollOffset: offset,
            scrollForward: offset > offsetRef.current,
            userScroll: userScrollRef.current,
          });

        const loadIndex = Math.floor((vStop + 1) / loadMoreThreshold);
        const startIndex = loadIndex * loadMoreThreshold;

        if (
          vStop !== vStopRef.current &&
          loadMoreRef.current &&
          !(isItemLoadedRef.current && isItemLoadedRef.current(loadIndex))
        )
          loadMoreRef.current({
            startIndex,
            stopIndex: startIndex + loadMoreThreshold - 1,
            loadIndex,
            scrollOffset: offset,
            userScroll: userScrollRef.current,
          });

        vStopRef.current = vStop;
        if (useIsScrolling) resetIsScrolling();
        if (!userScrollRef.current) resetUserScroll();
      }

      offsetRef.current = offset;
    },
    [
      getCalcData,
      getMeasures,
      itemCount,
      itemSizeKey,
      loadMoreRef,
      loadMoreThreshold,
      marginKey,
      onScrollRef,
      resetIsScrolling,
      resetUserScroll,
      sizeKey,
      useIsScrolling,
    ]
  );

  const scrollTo = useCallback<ScrollTo>(
    (value, cb) => {
      if (!outerRef.current) return;

      const { offset, smooth }: ScrollToOptions = isNumber(value)
        ? { offset: value }
        : value;
      const prevOffset = offsetRef.current;

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
          scrollRafRef.current = requestAnimationFrame(scroll);
        } else if (cb) {
          cb();
        }
      };

      scrollRafRef.current = requestAnimationFrame(scroll);
    },
    [easingFnRef, scrollDuration, scrollKey]
  );

  const scrollToItem = useCallback<ScrollToItem>(
    (value, cb) => {
      const {
        index,
        align = Align.auto,
        smooth,
        autoCorrect,
      }: ScrollToItemOptions = isNumber(value) ? { index: value } : value;

      if (!isNumber(index)) return;

      const measure =
        measuresRef.current[Math.max(0, Math.min(index, itemCount - 1))];

      if (!measure) return;

      const { start, end, size } = measure;
      const { [sizeKey]: outerSize } = outerRectRef.current;
      let { current: offset } = offsetRef;

      if (autoCorrect && offset <= start && offset + outerSize >= end && cb) {
        cb();
        return;
      }

      const endPos = start - outerSize + size;

      switch (align) {
        case Align.start:
          offset = start;
          break;
        case Align.center:
          offset = start - outerSize / 2 + size / 2;
          break;
        case Align.end:
          offset = endPos;
          break;
        default:
          if (offset >= start) {
            offset = start;
          } else if (offset + outerSize <= end) {
            offset = endPos;
          }
      }

      scrollTo({ offset, smooth }, () => {
        if (!autoCorrect) {
          if (cb) cb();
        } else if (
          autoCorrectTimesRef.current <= AUTO_CORRECT_LIMIT &&
          (offset >= start || offset + outerSize <= end)
        ) {
          setTimeout(() => scrollToItem(value, cb));
          autoCorrectTimesRef.current += 1;
        } else {
          if (cb) cb();
          autoCorrectTimesRef.current = 0;
        }
      });
    },
    [itemCount, scrollTo, sizeKey]
  );

  useResizeEffect<O>(
    outerRef,
    (rect) => {
      const isSameWidth = outerRectRef.current.width === rect.width;
      const { current: prevMeasures } = measuresRef;

      outerRectRef.current = rect;
      measuresRef.current = getMeasures(true);
      updateItems(offsetRef.current);

      const ratio =
        !isSameWidth &&
        prevMeasures.length &&
        measuresRef.current[measuresRef.current.length - 1].end /
          prevMeasures[prevMeasures.length - 1].end;

      if (ratio) scrollTo(offsetRef.current * ratio);
    },
    [itemCount, getMeasures, scrollTo, updateItems]
  );

  useIsoLayoutEffect(() => {
    const { current: outer } = outerRef;

    if (!outer) return () => null;

    const handleScroll = ({ target }: Event) =>
      updateItems((target as O)[scrollKey], true);

    outer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelResetIsScrolling();
      cancelResetUserScroll();
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = undefined;
      }

      while (roQueueRef.current.length) {
        let ro = roQueueRef.current.shift();
        ro?.disconnect();
        ro = undefined;
      }

      outer.removeEventListener("scroll", handleScroll);
    };
  }, [cancelResetIsScrolling, cancelResetUserScroll, scrollKey, updateItems]);

  return { outerRef, innerRef, items, scrollTo, scrollToItem };
};
