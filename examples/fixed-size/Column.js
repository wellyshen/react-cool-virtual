/* eslint-disable jsx-a11y/accessible-emoji */

import useVirtual from "react-cool-virtual";

import "./styles.scss";

const Column = () => {
  const { outerRef, innerRef, items } = useVirtual({
    horizontal: true,
    itemCount: 1000,
    itemSize: 100
  });

  return (
    <div
      className="outer"
      style={{ width: "300px", height: "75px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef} style={{ display: "flex" }}>
        {items.map(({ index, size }) => (
          <div
            key={index}
            className={`item ${index % 2 ? "dark" : ""}`}
            style={{ flexBasis: `${size}px`, height: "75px" }}
          >
            ♻️ {index}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Column;
