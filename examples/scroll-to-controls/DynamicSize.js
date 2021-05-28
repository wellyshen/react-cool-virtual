/* eslint-disable jsx-a11y/accessible-emoji */

import useVirtual from "react-cool-virtual";

import "./styles.scss";

const getSizes = (min) =>
  new Array(1000).fill().map(() => min + Math.round(Math.random() * 100));

const heights = getSizes(35);

const DynamicSize = () => {
  const { outerRef, innerRef, items, scrollToItem } = useVirtual({
    itemCount: heights.length
  });

  return (
    <>
      {/* When working with dyanmic size, we need turn on the auto */}
      <button onClick={() => scrollToItem({ index: 750, autoCorrect: true })}>
        Scroll to 750th
      </button>
      <div
        className="outer"
        style={{ width: "300px", height: "300px", overflow: "auto" }}
        ref={outerRef}
      >
        <div ref={innerRef}>
          {items.map(({ index, measureRef }) => (
            <div
              key={index}
              className={`item ${index % 2 ? "dark" : ""}`}
              style={{ height: `${heights[index]}px` }}
              ref={measureRef}
            >
              ♻️ {index}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DynamicSize;
