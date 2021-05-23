/* eslint-disable jsx-a11y/accessible-emoji */

import useVirtual from "react-cool-virtual";

import "./styles.scss";

const VerticalList = ({ rowHeights }) => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: rowHeights.length,
    itemSize: (idx) => rowHeights[idx]
  });

  return (
    <div
      className="outer"
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, size }) => (
          <div
            key={index}
            className={`item ${index % 2 && "light"}`}
            style={{ height: `${size}px` }}
          >
            ♻️ {index}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerticalList;
