/* import { Fragment, useState } from "react";
import useVirtual from "react-cool-virtual";
import { v4 as uuidv4 } from "uuid";

import "normalize.css";
import styles from "./styles.module.scss";

const sleep = (time: number) =>
  // eslint-disable-next-line compat/compat
  new Promise((resolve) => setTimeout(resolve, time));

const getMockData = (count: number, min = 25) =>
  // eslint-disable-next-line no-plusplus
  new Array(count).fill({}).map((_, idx) => ({
    text: uuidv4(),
    size: min + Math.round(Math.random() * 100),
  }));

const rowHeights = getMockData(100000);
const colWidths = getMockData(100000, 75);

export default (): JSX.Element => {
  const [sz, setSz] = useState(25);
  const row = useVirtual<HTMLDivElement, HTMLDivElement>({
    itemCount: rowHeights.length,
    onResize: (size: any) => console.log("LOG ===> ", size),
  });
  const col = useVirtual<HTMLDivElement, HTMLDivElement>({
    itemCount: colWidths.length,
    horizontal: true,
  });

  return (
    <div className={styles.app}>
      <div
        className={styles.outer}
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
                  className={`${styles.item} ${
                    // eslint-disable-next-line no-nested-ternary
                    rowItem.index % 2
                      ? colItem.index % 2
                        ? styles.dark
                        : ""
                      : !(colItem.index % 2)
                      ? styles.dark
                      : ""
                  }`}
                  style={{
                    position: "absolute",
                    height: `${rowHeights[rowItem.index].size}px`,
                    width: `${colWidths[colItem.index].size}px`,
                    // height: `${
                    //   rowItem.index ? rowHeights[rowItem.index].size : sz
                    // }px`,
                    // width: `${
                    //   colItem.index ? colWidths[colItem.index].size : sz
                    // }px`,
                    transform: `translateX(${colItem.start}px) translateY(${rowItem.start}px)`,
                  }}
                  ref={(el) => {
                    rowItem.measureRef(el);
                    colItem.measureRef(el);
                  }}
                >
                  {rowItem.index}, {colItem.index}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setSz((prev) => (prev === 25 ? 250 : 25))}
      >
        Resize
      </button>
    </div>
  );
}; */

import { useState } from "react";
import useVirtual from "react-cool-virtual";
import { v4 as uuidv4 } from "uuid";

import "normalize.css";
import styles from "./styles.module.scss";

const sleep = (time: number) =>
  // eslint-disable-next-line compat/compat
  new Promise((resolve) => setTimeout(resolve, time));
  
const getMockData = (count: number, min = 25) =>
  // eslint-disable-next-line no-plusplus
  new Array(count).fill({}).map((_, idx) => ({
    text: uuidv4(),
    size: min + Math.round(Math.random() * 100),
  }));

const mockData = getMockData(10);

export default (): JSX.Element => {
  const [sz, setSz] = useState(50);
  const { outerRef, innerRef, items } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    itemCount: mockData.length,
    overscanCount: 0,
  });

  return (
    <div className={styles.app}>
      <div className={styles.outer} ref={outerRef}>
        <div style={{ position: "relative" }} ref={innerRef}>
          {items.map(({ index, size, isScrolling, measureRef }) => (
            <div
              key={index}
              className={`${styles.item} ${index % 2 ? styles.dark : ""}`}
              style={{ height: `${mockData[index].size}px` }}
              // style={{ height: `${index === 1 ? sz : size}px` }}
              ref={measureRef}
            >
              {index}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setSz((prev) => (prev === 50 ? 200 : 50))}
      >
        Resize
      </button>
    </div>
  );
};
