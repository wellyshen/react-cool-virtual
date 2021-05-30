/* eslint-disable compat/compat */

import { useState } from "react";
import useVirtual from "react-cool-virtual";
import axios from "axios";

import "normalize.css";
import styles from "./styles.module.scss";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const itemLoadedArr: any[] = [];

let count = 0;

// @ts-expect-error
const loadData = async ({ loadIndex }, setComments) => {
  itemLoadedArr[loadIndex] = true;

  try {
    await sleep(2500);

    if (!count) {
      count += 1;
      throw new Error("Test");
    }

    const { data: comments } = await axios(
      `https://jsonplaceholder.typicode.com/comments?postId=${loadIndex + 1}`
    );

    // @ts-expect-error
    setComments((prevComments) => [...prevComments, ...comments]);
  } catch (err) {
    console.log("LOG ===> ", err);

    itemLoadedArr[loadIndex] = false;
    loadData({ loadIndex }, setComments);
  }
};

export default (): JSX.Element => {
  const [comments, setComments] = useState<any[]>([]);
  const { outerRef, innerRef, items } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    itemCount: 500,
    itemSize: 112,
    loadMoreThreshold: 5,
    isItemLoaded: (loadIndex) => itemLoadedArr[loadIndex],
    loadMore: (options) => loadData(options, setComments),
  });

  return (
    <div className={styles.app}>
      <div
        className={styles.outer}
        style={{ width: "300px", height: "300px", overflow: "auto" }}
        ref={outerRef}
      >
        <div ref={innerRef}>
          {items.map(({ index, measureRef }) => (
            <div
              key={index}
              className={`${styles.item} ${index % 2 ? styles.dark : ""}`}
              style={{ padding: "16px", minHeight: "112px" }}
              ref={measureRef}
            >
              {comments[index]?.body || "⏳ Loading..."}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
