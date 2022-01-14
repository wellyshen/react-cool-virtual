/* eslint-disable jsx-a11y/accessible-emoji */

import { useEffect, useState } from "react";
import { render } from "react-dom";

import useVirtual from "react-cool-virtual";
import axios from "axios";
import "./styles.scss";

const TOTAL_COMMENTS = 500;
const BATCH_COMMENTS = 5;
let shouldFetchData = true;
let postId = 100;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fetchData = async (postId, setComments) => {
  try {
    // Simulating a slow network
    await sleep(500);

    const { data: comments } = await axios(
      `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
    );

    // Pre-pend new items
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
    // When working with dynamic size, we can reduce scroll jumping
    // by providing an estimated item size
    itemSize: 180,
    onScroll: ({ scrollOffset }) => {
      // Tweak the threshold of data fetching that you want
      if (scrollOffset < 50 && shouldFetchData) {
        fetchData(--postId, setComments);
        shouldFetchData = false;
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
    scrollToItem({ index: BATCH_COMMENTS, align: "start" }, () => {
      // After the scroll position updated, re-allow data fetching
      if (comments.length < TOTAL_COMMENTS) shouldFetchData = true;
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
        style={{ width: "300px", height: "500px", overflow: "auto" }}
        ref={outerRef}
      >
        <div ref={innerRef}>
          {items.length ? (
            items.map(({ index, measureRef }) => (
              <div
                key={comments[index].id}
                className="item"
                ref={measureRef} // Used to measure the unknown item size
              >
                {comments[index].id}. {comments[index].body}
              </div>
            ))
          ) : (
            <div className="item">⏳ Loading...</div>
          )}
        </div>
      </div>
      <br />
      <br />
    </div>
  );
};

render(<App />, document.getElementById("root"));
