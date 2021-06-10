/* eslint-disable jsx-a11y/accessible-emoji */

import { Fragment, useEffect, useState } from "react";
import { render } from "react-dom";

import useVirtual from "react-cool-virtual";
import axios from "axios";
import "./styles.scss";

const TOTAL_COMMENTS = 500;
const BATCH_COMMENTS = 5;
let postId = 100;
let isLoading = false;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fetchData = async (postId, setComments) => {
  try {
    // Simulating a slow network
    await sleep(2000);

    const { data: comments } = await axios(
      `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
    );

    // Prepend new items
    setComments((prevComments) => [...comments, ...prevComments]);
  } catch (err) {
    // Try again
    fetchData(postId, setComments);
  }
};

const App = () => {
  const [comments, setComments] = useState([]);
  const { outerRef, innerRef, items, scrollToItem } = useVirtual({
    // Provide the number of comments
    itemCount: comments.length,
    onScroll: ({ visibleStartIndex }) => {
      if (
        // Pre-fetch data while the user scrolls to the first item
        // However, you can adjust the timing based on your case
        visibleStartIndex === 0 &&
        !isLoading &&
        comments.length < TOTAL_COMMENTS
      ) {
        fetchData(--postId, setComments);
        isLoading = true;
      }
    }
  });

  useEffect(() => {
    const fetchInitData = async () => {
      await fetchData(postId, setComments);
      await fetchData(--postId, setComments);
    };

    fetchInitData();
  }, []);

  useEffect(() => {
    // When working with dynamic size, we can use rAF to wait for
    // the items measured to avoid scroll jumping
    requestAnimationFrame(() => {
      // After the list updated, remain the scroll position for the user
      scrollToItem({ index: BATCH_COMMENTS, align: "start" });
      // Then re-allow data fetching
      isLoading = false;
    });
  }, [comments.length, scrollToItem]);

  return (
    <div className="app">
      <p>
        💡 CodeSandbox might be <b>caching the old version</b> of React Cool
        Virtual. You can <b>manually specify to the latest version</b> to see
        the examples.
      </p>
      <br />
      <div
        className="outer"
        style={{ width: "300px", height: "400px", overflow: "auto" }}
        ref={outerRef}
      >
        <div ref={innerRef}>
          {items.length ? (
            items.map(({ index, measureRef }) => (
              <Fragment key={comments[index].id}>
                <div
                  className={`item ${index % 2 ? "dark" : ""}`}
                  ref={measureRef} // Used to measure the unknown item size
                >
                  {comments[index].id}. {comments[index].body}
                </div>
              </Fragment>
            ))
          ) : (
            <div className="item">⏳ Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};

render(<App />, document.getElementById("root"));
