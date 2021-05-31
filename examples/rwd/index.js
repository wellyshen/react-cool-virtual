/* eslint-disable jsx-a11y/accessible-emoji */

import { render } from "react-dom";
import useVirtual from "react-cool-virtual";

import "./styles.scss";

const App = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 1000,
    // Use the outer's width (2nd parameter) to adjust the item's size
    itemSize: (_, width) => (width > 400 ? 50 : 100),
    // The event will be triggered on outer's size is being changed
    onResize: (rect) => console.log("Outer's rect: ", rect)
  });

  return (
    <div className="app">
      <p>
        💡 CodeSandbox might be <b>caching the wrong version</b> of React Cool
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
          {/* We can also access the outer's width here */}
          {items.map(({ index, size, width }) => (
            <div
              key={index}
              className={`item ${index % 2 ? "dark" : ""}`}
              style={{ height: `${size}px` }}
            >
              ♻️ {index} ({width})
            </div>
          ))}
        </div>
      </div>
      <small>(Move the handler to to see what happens)</small>
      <br />
    </div>
  );
};

render(<App />, document.getElementById("root"));
