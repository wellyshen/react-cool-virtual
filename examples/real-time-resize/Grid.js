/* eslint-disable jsx-a11y/accessible-emoji */

import { Fragment, useState, forwardRef } from "react";
import useVirtual from "react-cool-virtual";

import "./styles.scss";

let clickedItems = {};

const Item = forwardRef(
  (
    {
      children,
      rowIndex,
      colIndex,
      height,
      width,
      rowStart,
      colStart,
      onClick,
      ...rest
    },
    ref
  ) => (
    <div
      {...rest}
      style={{
        position: "absolute",
        height: `${height}px`,
        width: `${width}px`,
        transform: `translateX(${colStart}px) translateY(${rowStart}px)`
      }}
      ref={ref}
      onClick={() => {
        const hasClicked = clickedItems[`${rowIndex}-${colIndex}`];

        onClick({
          rowIndex,
          colIndex,
          height: hasClicked ? 100 : 150,
          width: hasClicked ? 100 : 150
        });

        clickedItems = {
          ...clickedItems,
          [`${rowIndex}-${colIndex}`]: !clickedItems[`${rowIndex}-${colIndex}`]
        };
      }}
    >
      {children}
    </div>
  )
);

const Grid = () => {
  const [itemData, setItemData] = useState({});
  const row = useVirtual({
    itemCount: 50,
    itemSize: 100
  });
  const col = useVirtual({
    horizontal: true,
    itemCount: 50,
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
              <Item
                key={colItem.index}
                className={`item ${
                  rowItem.index % 2
                    ? colItem.index % 2
                      ? "dark"
                      : ""
                    : !(colItem.index % 2)
                    ? "dark"
                    : ""
                }`}
                rowIndex={rowItem.index}
                colIndex={colItem.index}
                height={
                  rowItem.index === itemData.rowIndex
                    ? itemData.height
                    : rowItem.size
                }
                width={
                  colItem.index === itemData.colIndex
                    ? itemData.width
                    : colItem.size
                }
                rowStart={rowItem.start}
                colStart={colItem.start}
                ref={(el) => {
                  rowItem.measureRef(el);
                  colItem.measureRef(el);
                }}
                onClick={({ rowIndex, colIndex, ...rest }) =>
                  setItemData({ rowIndex, colIndex, ...rest })
                }
              >
                👋🏻 Click Me
              </Item>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Grid;
