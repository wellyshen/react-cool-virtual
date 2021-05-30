/* eslint-disable jsx-a11y/accessible-emoji */

import { useState } from "react";
import useVirtual from "react-cool-virtual";
import axios from "axios";

import "./styles.scss";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isItemLoadedArr = [];

const Skeleton = () => {
  const [comments, setComments] = useState([]);
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 500,
    // Estimated item size (with padding)
    itemSize: 112,
    // Starts to pre-fetch data when the user scrolls within every 5 items
    // e.g. 1-5, 6-10 and so on (default = 15)
    loadMoreThreshold: 5,
    // Provide the loaded state for a batch items to tell the hook
    // whether the `loadMore` should be triggered or not
    isItemLoaded: (loadIndex) => isItemLoadedArr[loadIndex],
    // The callback will be invoked when more data needs to be loaded
    loadMore: async ({ loadIndex }) => {
      // Set the state of a batch items as `true`
      // to avoid the callback from being invoked repeatedly
      isItemLoadedArr[loadIndex] = true;

      try {
        // Simulating a slow network
        await sleep(2500);

        const { data: comments } = await axios(
          `https://jsonplaceholder.typicode.com/comments?postId=${
            loadIndex + 1
          }`
        );

        setComments((prevComments) => [...prevComments, ...comments]);
      } catch (err) {
        // If there's an error leave the state as `false`
        // the callback will be invoked in the next time
        isItemLoadedArr[loadIndex] = false;
      }
    }
  });

  return (
    <div
      className="outer"
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, measureRef }) => (
          <div
            key={index}
            className={`item ${index % 2 ? "dark" : ""}`}
            style={{ padding: "16px", minHeight: "112px" }}
            ref={measureRef} // Used to measure the unknown item size
          >
            {comments[index]?.body || "⏳ Loading..."}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
