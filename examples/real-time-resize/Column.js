/* eslint-disable jsx-a11y/accessible-emoji */

import { useState, forwardRef } from "react";
import useVirtual from "react-cool-virtual";

import "./styles.scss";

const Item = forwardRef(({ children, width, ...rest }, ref) => {
  const [w, setW] = useState(width);

  return (
    <div
      {...rest}
      style={{ minWidth: `${w}px`, minHeight: "75px" }}
      ref={ref}
      onClick={() => setW((prevH) => (prevH === 100 ? 150 : 100))}
    >
      {children}
    </div>
  );
});

const Column = () => {
  const { outerRef, innerRef, items } = useVirtual({
    horizontal: true,
    itemCount: 50,
    itemSize: 100
  });

  return (
    <div
      className="outer"
      style={{ width: "300px", height: "75px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef} style={{ display: "flex" }}>
        {items.map(({ index, size, measureRef }) => (
          <Item
            key={index}
            className={`item ${index % 2 ? "dark" : ""}`}
            width={size}
            ref={measureRef}
          >
            👋🏻 Click Me
          </Item>
        ))}
      </div>
    </div>
  );
};

export default Column;
