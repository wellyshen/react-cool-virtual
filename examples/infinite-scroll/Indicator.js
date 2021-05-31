/* eslint-disable jsx-a11y/accessible-emoji */

import { Fragment, useState } from "react";
import useVirtual from "react-cool-virtual";
import axios from "axios";

import "./styles.scss";

const TOTAL_COMMENTS = 500;
const BATCH_COMMENTS = 5;
const isItemLoadedArr = [];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const loadData = async ({ loadIndex }, setComments) => {
  // Set the state of a batch items as `true`
  // to avoid the callback from being invoked repeatedly
  isItemLoadedArr[loadIndex] = true;

  try {
    // Simulating a slow network
    await sleep(2500);

    const { data: comments } = await axios(
      `https://jsonplaceholder.typicode.com/comments?postId=${loadIndex + 1}`
    );

    setComments((prevComments) => [...prevComments, ...comments]);
  } catch (err) {
    // If there's an error set the state back to `false`
    isItemLoadedArr[loadIndex] = false;
    // Then try again
    loadData({ loadIndex }, setComments);
  }
};

const Loading = () => <div className="item">⏳ Loading...</div>;

const Indicator = () => {
  const [comments, setComments] = useState([]);
  const { outerRef, innerRef, items } = useVirtual({
    // // Provide the number of comments
    itemCount: comments.length,
    // Starts to pre-fetch data when the user scrolls within every 5 items
    // e.g. 1 - 5, 6 - 10 and so on (default = 15)
    loadMoreThreshold: BATCH_COMMENTS,
    // Provide the loaded state for a batch items to tell the hook
    // whether the `loadMore` should be triggered or not
    isItemLoaded: (loadIndex) => isItemLoadedArr[loadIndex],
    // The callback will be invoked when more data needs to be loaded
    loadMore: (e) => loadData(e, setComments)
  });

  return (
    <div
      className="outer"
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.length ? (
          items.map(({ index, measureRef }) => {
            const len = comments.length;
            const showLoading = index === len - 1 && len < TOTAL_COMMENTS;

            return (
              <Fragment key={comments[index].id}>
                <div
                  className={`item ${index % 2 ? "dark" : ""}`}
                  style={{ padding: "16px" }}
                  ref={measureRef} // Used to measure the unknown item size
                >
                  {comments[index].body}
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
  );
};

export default Indicator;
