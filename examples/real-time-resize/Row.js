/* eslint-disable jsx-a11y/accessible-emoji */

import { useState, forwardRef } from "react";
import useVirtual from "react-cool-virtual";

import "./styles.scss";

const Item = forwardRef(({ children, height, ...rest }, ref) => {
  const [h, setH] = useState(height);

  return (
    <div
      {...rest}
      style={{ height: `${h}px` }}
      ref={ref}
      onClick={() => setH((prevH) => (prevH === 50 ? 100 : 50))}
    >
      {children}
    </div>
  );
});

const Row = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 50
  });

  return (
    <div
      className="outer"
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, size, measureRef }) => (
          <Item
            key={index}
            className={`item ${index % 2 ? "dark" : ""}`}
            height={size}
            ref={measureRef}
          >
            👋🏻 Click Me
          </Item>
        ))}
      </div>
    </div>
  );
};

export default Row;
