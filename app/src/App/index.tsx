/* eslint-disable compat/compat */

import useVirtual from "react-cool-virtual";
import normalize from "normalize.css";

import styles from "./styles.module.scss";

export default () => {
  const { outerRef, innerRef, items, scrollToItem } =
    useVirtual<HTMLDivElement>({
      itemCount: 100,
      onScroll: ({ userScroll }) => console.log("LOG ===> ", userScroll),
    });

  return (
    <>
      <button type="button" onClick={() => scrollToItem(50)}>
        Test
      </button>
      <div
        className={styles.outer}
        style={{ width: "300px", height: "500px", overflow: "auto" }}
        ref={outerRef}
      >
        <div ref={innerRef}>
          {items.map(({ index, size }) => (
            <div
              key={index}
              className={`${styles.item} ${index % 2 ? styles.dark : ""}`}
              style={{ height: `${size}px` }}
            >
              {index}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
