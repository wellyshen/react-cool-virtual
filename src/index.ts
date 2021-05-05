import { useLayoutEffect, useRef, useState } from "react";

const getStyleValue = (el, attrs) => {
  const style = getComputedStyle(el);
  
  return attrs.reduce((acc, attr) => {
    acc += +style[attr].replace("px", "");
    return acc;
  }, 0);
};

const useVirtual = ({ itemData, itemSize }) => {
  const containerRef = useRef();
  const itemDataRef = useRef(itemData);
  const [items, setItems] = useState([]);

  useLayoutEffect(() => {
    if (!containerRef.current || !itemSize) return () => null;

    const { current: parent } = containerRef;
    const { current: data } = itemDataRef;
    const extendCount = 2;
    const paddingH = getStyleValue(parent, ["paddingTop", "paddingBottom"]);
    const displayCount = (parent.clientHeight - paddingH) / itemSize;

    const updateItems = (idx) => {
      const start = Math.max(idx - extendCount, 0);
      const end = Math.min(idx + displayCount + extendCount, data.length);
      const marginT = start * itemSize;
      const marginB = (data.length - end) * itemSize;

      setItems(
        data.slice(start, end).map((data, idx, arr) => ({
          data,
          index: idx + start,
          ref: (el) => {
            if (!el) return;

            el.style.marginTop = "";
            el.style.marginBottom = "";
            el.style.height = `${itemSize}px`;

            if (!idx) el.style.marginTop = `${marginT}px`;
            if (idx === arr.length - 1) el.style.marginBottom = `${marginB}px`;
          },
        }))
      );
    };

    updateItems(0);

    let prevStartIdx;

    const scrollHandler = ({ target: { scrollTop } }) => {
      const idx = Math.floor(scrollTop / itemSize);

      if (idx !== prevStartIdx) {
        updateItems(idx);
        prevStartIdx = idx;
      }
    };

    parent.addEventListener("scroll", scrollHandler);

    return () => {
      parent.removeEventListener("scroll", scrollHandler);
    };
  }, [itemSize]);

  return { containerRef, items };
};

export default useVirtual;
