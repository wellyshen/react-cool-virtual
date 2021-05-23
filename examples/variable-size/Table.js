/* eslint-disable jsx-a11y/accessible-emoji */

import { Fragment } from "react";
import useVirtual from "react-cool-virtual";

import "./styles.scss";

const VerticalList = () => {
  const row = useVirtual({
    itemCount: 10000
  });
  const col = useVirtual({
    horizontal: true,
    itemCount: 10000,
    itemSize: 100
  });

  return (
    <div
      className="outer"
      style={{ width: "400px", height: "400px", overflow: "auto" }}
      ref={(el) => {
        row.outerRef.current = el;
        col.outerRef.current = el;
      }}
    >
      <div
        style={{ position: "relative" }}
        ref={(el) => {
          row.innerRef.current = el;
          col.innerRef.current = el;
        }}
      >
        {row.items.map((rowItem) => (
          <Fragment key={rowItem.index}>
            {col.items.map((colItem) => (
              <div
                key={colItem.index}
                className={`item ${
                  rowItem.index % 2
                    ? colItem.index % 2 && "light"
                    : !(colItem.index % 2) && "light"
                }`}
                style={{
                  position: "absolute",
                  height: `${rowItem.size}px`,
                  width: `${colItem.size}px`,
                  transform: `translateX(${colItem.start}px) translateY(${rowItem.start}px)`
                }}
              >
                ♻️ {rowItem.index}, {colItem.index}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default VerticalList;
