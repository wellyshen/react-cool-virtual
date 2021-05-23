import { Fragment } from "react";
import useVirtual from "react-cool-virtual";
import { v4 as uuidv4 } from "uuid";

import "normalize.css";
import styles from "./styles.module.scss";

const sleep = (time: number) =>
  // eslint-disable-next-line compat/compat
  new Promise((resolve) => setTimeout(resolve, time));

const getMockData = (count: number) =>
  // eslint-disable-next-line no-plusplus
  new Array(count).fill({}).map((_, idx) => ({
    text: uuidv4(),
    size: 25 + Math.round(Math.random() * 100),
  }));

export default (): JSX.Element => {
  const row = useVirtual<HTMLDivElement, HTMLDivElement>({
    itemCount: 10000,
    itemSize: 35,
    overscanCount: 5,
  });
  const col = useVirtual<HTMLDivElement, HTMLDivElement>({
    itemCount: 10000,
    itemSize: 100,
    overscanCount: 5,
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
                      ? colItem.index % 2 && styles.dark
                      : !(colItem.index % 2) && styles.dark
                  }`}
                  style={{
                    position: "absolute",
                    height: `${rowItem.size}px`,
                    width: `${colItem.size}px`,
                    transform: `translateX(${colItem.start}px) translateY(${rowItem.start}px)`,
                  }}
                >
                  {rowItem.index}, {colItem.index}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
