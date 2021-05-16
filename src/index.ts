import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from "react";

import {
  Align,
  Data,
  Item,
  ItemSize,
  Measure,
  OnScroll,
  Options,
  Return,
  ScrollingEffect,
  ScrollTo,
  ScrollToOptions,
  ScrollToItem,
  ScrollToItemOptions,
} from "./types";
import {
  createIndexes,
  findNearestBinarySearch,
  invariant,
  isNumber,
  isUndefined,
  now,
  useAnimDebounce,
  // useIsoLayoutEffect,
  useLatest,
  useResizeEffect,
} from "./utils";

const DEFAULT_ITEM_SIZE = 50;
const DEFAULT_EASING_DURATION = 500;
const DEFAULT_EASING_FUNCTION = (t: number) =>
  t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
const ANIM_DEBOUNCE_INTERVAL = 200;

const useVirtual = <
  O extends HTMLElement = HTMLElement,
  I extends HTMLElement = HTMLElement,
  D extends Data = Data
>({
  itemData,
  itemCount,
  itemSize = DEFAULT_ITEM_SIZE,
  horizontal,
  overscanCount = 1,
  useIsScrolling,
  scrollingEffect,
  onScroll,
}: Options<D>): Return<O, I, D> => {
  const [items, setItems] = useState<Item<D>[]>([]);
  const offsetRef = useRef(0);
  const outerRef = useRef<O>(null);
  const innerRef = useRef<I>(null);
  const itemDataRef = useRef<D[] | undefined>(itemData);
  const outerSizeRef = useRef(0);
  const measuresRef = useRef<Measure[]>([]);
  const userScrollRef = useRef(true);
  const scrollRafIdRef = useRef<number>();
  const scrollingEffectRef = useRef<ScrollingEffect>(scrollingEffect || {});
  const itemSizeRef = useLatest<ItemSize>(itemSize);
  const onScrollRef = useLatest<OnScroll | undefined>(onScroll);
  const sizeKey = !horizontal ? "height" : "width";
  const observerSizeKey = !horizontal ? "blockSize" : "inlineSize";
  const marginKey = !horizontal ? "marginTop" : "marginLeft";
  const scrollKey = !horizontal ? "scrollTop" : "scrollLeft";
  const directionDR = !horizontal ? "down" : "right";
  const directionUL = !horizontal ? "up" : "left";
  itemCount = !isUndefined(itemCount) ? itemCount : itemData?.length;

  const getItemSize = useCallback(
    (idx: number) => {
      if (measuresRef.current[idx]) return measuresRef.current[idx].size;

      let { current: size } = itemSizeRef;
      size = isNumber(size) ? size : size(idx);

      return size ?? DEFAULT_ITEM_SIZE;
    },
    [itemSizeRef]
  );

  const getMeasures = useCallback(() => {
    if (!itemCount) return [];

    const measures: Measure[] = [];

    for (let i = 0; i < itemCount; i += 1) {
      const start = i ? measures[i - 1].end : 0;
      const size = getItemSize(i);

      measures[i] = { idx: i, start, end: start + size, size };
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

  const [resetIsScrolling, cancelResetIsScrolling] = useAnimDebounce(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    () => updateItems(offsetRef.current, false),
    ANIM_DEBOUNCE_INTERVAL
  );

  const [resetUserScroll, cancelResetUserScroll] = useAnimDebounce(
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    () => {
      userScrollRef.current = true;
    },
    ANIM_DEBOUNCE_INTERVAL
  );

  const updateItems = useCallback(
    (offset: number, isScrolling = true) => {
      const { current: inner } = innerRef;

      if (!inner) return;

      const { startIdx, endIdx, start, end, margin, innerSize } =
        getCalcData(offset);

      inner.style[marginKey] = `${margin}px`;
      inner.style[sizeKey] = `${innerSize}px`;

      const nextItems: Item<D>[] = [];
      let shouldRecalc = false;

      for (let i = start; i <= end; i += 1)
        nextItems[i] = {
          data: itemDataRef.current ? itemDataRef.current[i] : undefined,
          index: i,
          size: measuresRef.current[i].size,
          outerSize: outerSizeRef.current,
          isScrolling: useIsScrolling ? isScrolling : undefined,
          // eslint-disable-next-line no-loop-func
          measureRef: (el) => {
            if (!el) return;

            // eslint-disable-next-line compat/compat
            let observer: ResizeObserver | null = new ResizeObserver(
              ([{ borderBoxSize }]) => {
                const { [observerSizeKey]: size } = borderBoxSize[0];

                if (size !== measuresRef.current[i].size) {
                  measuresRef.current[i].size = size;
                  shouldRecalc = true;
                }

                if (i === end && shouldRecalc) {
                  measuresRef.current = getMeasures();
                  updateItems(offset, isScrolling);
                }

                observer?.disconnect();
                observer = null;
              }
            );

            observer.observe(el);
          },
        };

      setItems(nextItems);

      if (isScrolling) {
        if (onScrollRef.current)
          onScrollRef.current({
            overscanIndexes: createIndexes(start, end),
            itemIndexes: createIndexes(startIdx, endIdx),
            offset,
            direction: offset > offsetRef.current ? directionDR : directionUL,
            userScroll: userScrollRef.current,
          });

        if (useIsScrolling) resetIsScrolling();
        if (!userScrollRef.current) resetUserScroll();
      }

      offsetRef.current = offset;
    },
    [
      directionDR,
      directionUL,
      getCalcData,
      getMeasures,
      marginKey,
      observerSizeKey,
      onScrollRef,
      resetIsScrolling,
      resetUserScroll,
      sizeKey,
      useIsScrolling,
    ]
  );

  const scrollTo = useCallback<ScrollTo>(
    (value) => {
      if (!outerRef.current) return;

      const { offset, smooth, callback }: ScrollToOptions = isNumber(value)
        ? { offset: value }
        : value;
      const prevOffset = offsetRef.current;

      if (isUndefined(offset) || offset === prevOffset) return;

      userScrollRef.current = false;

      if (
        smooth === false ||
        (isUndefined(smooth) && !Object.keys(scrollingEffectRef.current).length)
      ) {
        outerRef.current[scrollKey] = offset;
        return;
      }

      const start = now();
      const {
        duration = DEFAULT_EASING_DURATION,
        easingFunction = DEFAULT_EASING_FUNCTION,
      } = scrollingEffectRef.current;

      const scroll = () => {
        const time = Math.min((now() - start) / duration, 1);

        outerRef.current![scrollKey] =
          easingFunction(time) * (offset - prevOffset) + prevOffset;

        if (time < 1) {
          scrollRafIdRef.current = requestAnimationFrame(scroll);
        } else if (callback) {
          callback();
        }
      };

      scrollRafIdRef.current = requestAnimationFrame(scroll);
    },
    [scrollKey]
  );

  const handleScrollToItem = useCallback(
    ({ index, align = Align.auto, smooth, callback }: ScrollToItemOptions) => {
      if (!itemCount) return;

      const { start, end, size } =
        measuresRef.current[Math.max(0, Math.min(index, itemCount - 1))];
      const { current: outerSize } = outerSizeRef;
      let offset = offsetRef.current;
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
          if (offset < start - outerSize + size) {
            offset = endPos;
          } else if (offset > end - size) {
            offset = start;
          }
      }

      scrollTo({ offset, smooth, callback });
    },
    [itemCount, scrollTo]
  );

  const scrollToItem = useCallback<ScrollToItem>(
    (value) => {
      const { callback, ...rest }: ScrollToItemOptions = isNumber(value)
        ? { index: value }
        : value;

      if (!isUndefined(rest.index)) {
        // For dynamic size, measuring the items first to get the target's data
        handleScrollToItem(rest);
        // Then we can scroll to the right position of the target
        setTimeout(() => handleScrollToItem({ callback, ...rest }));
      }
    },
    [handleScrollToItem]
  );

  useResizeEffect<O>(
    outerRef,
    (rect) => {
      outerSizeRef.current = rect[sizeKey];
      measuresRef.current = getMeasures();

      updateItems(offsetRef.current, false);
    },
    itemCount
  );

  useLayoutEffect(() => {
    const { current: outer } = outerRef;

    invariant(!outer, "Outer error");
    invariant(!innerRef.current, "Inner error");
    invariant(isUndefined(itemCount), "Item count error");

    const handleScroll = ({ target }: Event) =>
      updateItems((target as O)[scrollKey]);

    outer!.addEventListener("scroll", handleScroll);

    return () => outer!.removeEventListener("scroll", handleScroll);
  }, [itemCount, scrollKey, updateItems]);

  useEffect(
    () => () => {
      cancelResetIsScrolling();
      cancelResetUserScroll();
      if (scrollRafIdRef.current) {
        cancelAnimationFrame(scrollRafIdRef.current);
        scrollRafIdRef.current = undefined;
      }
    },
    [cancelResetIsScrolling, cancelResetUserScroll]
  );

  return { outerRef, innerRef, items, scrollTo, scrollToItem };
};

export default useVirtual;
