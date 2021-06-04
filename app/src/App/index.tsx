/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */

import { useState, forwardRef } from "react";
import useVirtual from "react-cool-virtual";
import axios from "axios";

import styles from "./styles.module.scss";

const AccordionItem = forwardRef(({ height, ...rest }: any, ref: any) => {
  const [h, setH] = useState<number>(height);

  return (
    <div
      {...rest}
      style={{ height: `${h}px`, cursor: "pointer", padding: "0" }}
      ref={ref}
      onClick={() => setH((prevH) => (prevH === 120 ? 240 : 120))}
    >
      🪗 Real-time resize
    </div>
  );
});

// eslint-disable-next-line compat/compat
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const isItemLoadedArr: any[] = [];

export default () => {
  const [outerSize, setOutersize] = useState<{
    width?: number;
    height?: number;
  }>({});
  const [comments, setComments] = useState<any[]>([]);
  const { outerRef, innerRef, items } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    itemCount: 60,
    itemSize: 120,
    loadMoreCount: 5,
    isItemLoaded: (idx) => isItemLoadedArr[idx],
    loadMore: async ({ loadIndex }) => {
      if (loadIndex >= 10) return;

      isItemLoadedArr[loadIndex] = true;

      await sleep(2000);
      const { data } = await axios(
        `https://jsonplaceholder.typicode.com/comments?postId=${loadIndex + 1}`
      );

      setComments((prevComments) => [...prevComments, ...data]);
    },
    onResize: setOutersize,
  });

  return (
    <div className={styles.app}>
      {Object.keys(outerSize).length ? (
        <p>
          Container size: {Math.floor(outerSize.width || 0)} x{" "}
          {Math.floor(outerSize.height || 0)}
        </p>
      ) : null}
      <div className={styles.outer} ref={outerRef}>
        <div ref={innerRef}>
          {items.map(({ index, size, measureRef }) =>
            index <= 49 ? (
              <div
                key={index}
                className={`${styles.item} ${index % 2 ? styles.dark : ""}`}
                ref={measureRef}
              >
                {comments[index]
                  ? `${comments[index].id}. ${comments[index].body}`
                  : "⏳ Loading..."}
              </div>
            ) : (
              <AccordionItem
                key={index}
                className={`${styles.item} ${index % 2 ? styles.dark : ""}`}
                height={size}
                ref={measureRef}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};
