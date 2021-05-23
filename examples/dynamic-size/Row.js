/* eslint-disable jsx-a11y/accessible-emoji */

import useVirtual from "react-cool-virtual";

import "./styles.scss";

const Row = ({ rowHeights }) => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: rowHeights.length,
    itemSize: 75 // The unmeasured item sizes will refer to this value (default = 50)
  });

  return (
    <div
      className="outer"
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, size, measureRef }) => (
          <div
            key={index}
            className={`item ${index % 2 && "light"}`}
            style={{ height: `${rowHeights[index]}px` }}
            ref={measureRef} // It will measure the item size for us
          >
            📏 {size}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Row;
