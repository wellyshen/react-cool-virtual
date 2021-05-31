/* eslint-disable compat/compat */

import { useState } from "react";
import useVirtual from "react-cool-virtual";

import "normalize.css";
import styles from "./styles.module.scss";

const getData = (num: number) =>
  new Array(num).fill({}).map((_, idx) => ({
    txt: idx,
    size: Math.floor(25 + Math.random() * 100),
  }));

const mockData = getData(50);

export default (): JSX.Element => {
  const [sz, setSz] = useState(50);
  const { outerRef, innerRef, items } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    itemCount: mockData.length,
    useIsScrolling: true,
    itemSize: (_, width) => (width > 600 ? 100 : 50),
  });

  return (
    <div className={styles.app}>
      <div className={styles.outer} ref={outerRef}>
        <div ref={innerRef}>
          {items.map(({ index, size, isScrolling, measureRef }) => (
            <div
              key={index}
              className={`${styles.item} ${index % 2 ? styles.dark : ""}`}
              // style={{ height: `${mockData[index].size}px` }}
              style={{ height: `${index === 10 ? sz : 50}px` }}
              ref={measureRef}
            >
              {index}
              {/* {isScrolling ? "Scrolling... " : index} */}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setSz((prevSz) => (prevSz === 50 ? 200 : 50))}
      >
        Resize
      </button>
    </div>
  );
};
