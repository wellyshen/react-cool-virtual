/* eslint-disable jsx-a11y/accessible-emoji */

import { render } from "react-dom";
import useVirtual from "react-cool-virtual";

import "./styles.scss";

const emojis = [
  "Moods",
  "π",
  "π€¬",
  "π­",
  "π€©",
  "π€ͺ",
  "Animals",
  "π¨",
  "πΆ",
  "π°",
  "π»ββοΈ",
  "π·",
  "Fruits",
  "π",
  "π",
  "π",
  "π",
  "π",
  "Sports",
  "β½οΈ",
  "π",
  "π",
  "βΎοΈ",
  "π±",
  "Accessories",
  "βοΈ",
  "π§¦",
  "π",
  "π§’",
  "π"
];

const App = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 30,
    // The values must be provided in ascending order
    stickyIndices: [0, 6, 12, 18, 24]
  });

  return (
    <div className="app">
      <p>
        π‘ CodeSandbox might be <b>caching the old version</b> of React Cool
        Virtual. You can <b>manually specify to the latest version</b> to see
        the examples.
      </p>
      <br />
      <div
        className="outer"
        style={{ width: "300px", height: "300px", overflow: "auto" }}
        ref={outerRef}
      >
        <div ref={innerRef}>
          {items.map(({ index, size, isSticky }) => {
            let style = { height: `${size}px` };
            // Use the `isSticky` property to style the sticky item, that's it β¨
            style = isSticky
              ? { ...style, position: "sticky", top: "0" }
              : style;

            return (
              <div
                key={index}
                className={`item ${isSticky ? "sticky" : ""}`}
                style={style}
              >
                {emojis[index]}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

render(<App />, document.getElementById("root"));
