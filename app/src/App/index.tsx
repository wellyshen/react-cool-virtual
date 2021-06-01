/* eslint-disable compat/compat */

import { forwardRef, useState, memo, useMemo } from "react";
import useVirtual from "react-cool-virtual";

import styles from "./styles.module.scss";

const getItems = (num: number) =>
  new Array(num).fill({}).map((_, idx) => ({
    txt: idx,
    size: Math.floor(50 + Math.random() * 100),
  }));

const mockData = getItems(100);

const Item = memo(
  // eslint-disable-next-line react/prop-types
  ({ index, size, ...rest }: any) => {
    console.log("LOG ===> Re-render", index);

    return (
      <div {...rest} style={{ height: `${size}px` }} tabIndex="0" role="button">
        COOL
      </div>
    );
  }
);

export default () => {
  const [sz, setSz] = useState(50);
  const { outerRef, innerRef, items } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({ itemCount: mockData.length });

  return (
    <div className={styles.app}>
      <div className={styles.outer} ref={outerRef}>
        <div ref={innerRef}>
          {items.map(({ index, measureRef }) => (
            <Item
              key={index}
              index={index}
              className={`${styles.item} ${index % 2 ? styles.dark : ""}`}
              size={50}
            />
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

/* import { Fragment, useState } from "react";
import useVirtual from "react-cool-virtual";
import axios from "axios";

import styles from "./styles.module.scss";

const TOTAL_COMMENTS = 500;
const BATCH_COMMENTS = 5;
const isItemLoadedArr: any[] = [];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const loadData = async ({ loadIndex }: any, setComments: any) => {
  // Set the state of a batch items as `true`
  // to avoid the callback from being invoked repeatedly
  isItemLoadedArr[loadIndex] = true;

  try {
    // Simulating a slow network
    await sleep(2500);

    const { data: comments } = await axios(
      `https://jsonplaceholder.typicode.com/comments?postId=${loadIndex + 1}`
    );

    setComments((prevComments: any) => [...prevComments, ...comments]);
  } catch (err) {
    // If there's an error set the state back to `false`
    isItemLoadedArr[loadIndex] = false;
    // Then try again
    loadData({ loadIndex }, setComments);
  }
};

const Loading = () => <div className="item">⏳ Loading...</div>;

export default () => {
  const [comments, setComments] = useState<any[]>([]);
  const { outerRef, innerRef, items } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    // // Provide the number of comments
    // itemCount: comments.length,
    itemCount: 500,
    // Estimated item size (with padding)
    // itemSize: 122,
    // Starts to pre-fetch data when the user scrolls within every 5 items
    // e.g. 1-5, 6-10 and so on (default = 15)
    loadMoreThreshold: BATCH_COMMENTS,
    // Provide the loaded state for a batch items to tell the hook
    // whether the `loadMore` should be triggered or not
    isItemLoaded: (loadIndex) => isItemLoadedArr[loadIndex],
    // The callback will be invoked when more data needs to be loaded
    loadMore: (e) => loadData(e, setComments),
  });

  return (
    <div className={styles.app}>
      <div className={styles.outer} ref={outerRef}>
        <div ref={innerRef}>
          {items.length ? (
            items.map(({ index, measureRef }) => {
              const len = comments.length;
              const showLoading = index === len - 1 && len < TOTAL_COMMENTS;

              return (
                <Fragment key={index}>
                  <div
                    className={`${styles.item} ${index % 2 ? styles.dark : ""}`}
                    style={{ padding: "16px" }}
                    ref={measureRef} // Used to measure the unknown item size
                  >
                    {comments[index]?.body || "Loading..."}
                  </div>
                  {showLoading && <Loading />}
                </Fragment>
              );
            })
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </div>
  );
}; */
