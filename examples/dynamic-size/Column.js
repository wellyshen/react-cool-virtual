/* eslint-disable jsx-a11y/accessible-emoji */

import useVirtual from "react-cool-virtual";

import "./styles.scss";

const Column = ({ colWidths }) => {
  const { outerRef, innerRef, items } = useVirtual({
    horizontal: true,
    itemCount: colWidths.length,
    itemSize: 75 // The unmeasured item sizes will refer to this value (default = 50)
  });

  return (
    <div
      className="outer"
      style={{ width: "300px", height: "75px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef} style={{ display: "flex" }}>
        {items.map(({ index, size, measureRef }) => (
          <div
            key={index}
            className={`item ${index % 2 ? "light" : ""}`}
            style={{ minWidth: `${colWidths[index]}px`, height: "75px" }}
            ref={measureRef} // It will measure the item size for us
          >
            📏 {size}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Column;
