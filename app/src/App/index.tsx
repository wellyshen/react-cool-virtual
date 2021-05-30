import { useState } from "react";
import useVirtual from "react-cool-virtual";
import axios from "axios";

import "normalize.css";
import styles from "./styles.module.scss";

const itemLoadedArr: any[] = [];

export default (): JSX.Element => {
  const [commentData, setCommentData] = useState<any[]>([]);
  const { outerRef, innerRef, items } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    itemCount: 500,
    itemSize: 112,
    loadMoreThreshold: 5,
    isItemLoaded: (idx) => itemLoadedArr[idx],
    loadMore: async ({ loadIndex }) => {
      itemLoadedArr[loadIndex] = true;

      try {
        const { data } = await axios(
          `https://jsonplaceholder.typicode.com/comments?postId=${
            loadIndex + 1
          }`
        );

        setCommentData((prevData) => [...prevData, ...data]);
      } catch (err) {
        itemLoadedArr[loadIndex] = false;
      }
    },
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
              {commentData[index]?.body || "⏳ Loading..."}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
