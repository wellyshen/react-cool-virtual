/* eslint-disable jsx-a11y/accessible-emoji */

import { useState } from "react";
import { render } from "react-dom";
import useVirtual from "react-cool-virtual";

import "./styles.scss";

const App = () => {
  const [itemCount, setItemCount] = useState(100);
  const { outerRef, innerRef, items } = useVirtual({
    itemCount,
    // Resets the scroll position when the `itemCount` changed (default = false)
    resetScroll: true
  });

  return (
    <div className="app">
      <p>
        💡 CodeSandbox might be <b>caching the old version</b> of React Cool
        Virtual. You can <b>manually specify to the latest version</b> to see
        the examples.
      </p>
      <br />
      <select onChange={({ target }) => setItemCount(target.value)}>
        <option value="100">100</option>
        <option value="50">50</option>
        <option value="25">25</option>
      </select>
      <div
        className="outer"
        style={{ width: "300px", height: "300px", overflow: "auto" }}
        ref={outerRef}
      >
        <div ref={innerRef}>
          {items.map(({ index, size }) => (
            <div
              key={index}
              className={`item ${index % 2 ? "dark" : ""}`}
              style={{ height: `${size}px` }}
            >
              ♻️ {index}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

render(<App />, document.getElementById("root"));
