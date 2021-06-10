/* eslint-disable jsx-a11y/accessible-emoji */

import { useState, useEffect } from "react";
import { render } from "react-dom";
import useVirtual from "react-cool-virtual";
import axios from "axios";

import "./styles.scss";

const TOTAL_MESSAGES = 200;
let isScrolling = false; // Used to prevent UX conflict
let id = 0;

const loadData = async (id, setMessages) => {
  try {
    const { data: messages } = await axios(
      `https://jsonplaceholder.typicode.com/todos/${id}`
    );

    setMessages((prevMessages) => [...prevMessages, messages]);
  } catch (err) {
    loadData(id, setMessages);
  }
};

const App = () => {
  const [shouldSticky, setShouldSticky] = useState(true);
  const [messages, setMessages] = useState([]);
  const { outerRef, innerRef, items, scrollToItem } = useVirtual({
    itemCount: messages.length,
    scrollDuration: 50, // Speed up smooth scrolling
    onScroll: ({ userScroll }) => {
      // If the user scrolls and isn't automatically scrolling, cancel stick to bottom
      if (userScroll && !isScrolling) setShouldSticky(false);
    }
  });

  useEffect(() => {
    // Mock messages service
    if (id <= TOTAL_MESSAGES)
      setTimeout(
        () => loadData(++id, setMessages),
        Math.floor(500 + Math.random() * 2000)
      );
  }, [messages.length]);

  useEffect(() => {
    // Automatically stick to bottom, using smooth scrolling for better UX
    if (shouldSticky) {
      isScrolling = true;
      scrollToItem({ index: messages.length - 1, smooth: true }, () => {
        isScrolling = false;
      });
    }
  }, [messages.length, shouldSticky, scrollToItem]);

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
          {items.map(({ index, measureRef }) => (
            <div
              key={`${messages[index].id}`}
              className={`item ${index % 2 ? "right" : ""}`}
              ref={measureRef} // Used to measure the unknown item size
            >
              <div>{messages[index].title}</div>
            </div>
          ))}
        </div>
      </div>
      {!shouldSticky && (
        <button onClick={() => setShouldSticky(true)}>Stick to Bottom</button>
      )}
    </div>
  );
};

render(<App />, document.getElementById("root"));
