/* eslint-disable compat/compat */

import { useState } from "react";
import useVirtual from "react-cool-virtual";

import "normalize.css";
import styles from "./styles.module.scss";

export default (): JSX.Element => {
  const [sz, setSz] = useState(50);
  const { outerRef, innerRef, items } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    itemCount: 50,
    itemSize: (_, width) => (width > 600 ? 100 : 50),
  });

  return (
    <div className={styles.app}>
      <div className={styles.outer} ref={outerRef}>
        <div ref={innerRef}>
          {items.map(({ index, size, measureRef }) => (
            <div
              key={index}
              className={`${styles.item} ${index % 2 ? styles.dark : ""}`}
              style={{ height: `${size}px` }}
              // ref={measureRef}
            >
              {index}
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
