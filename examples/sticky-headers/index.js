/* eslint-disable jsx-a11y/accessible-emoji */

import { render } from "react-dom";
import useVirtual from "react-cool-virtual";

import "./styles.scss";

const emojis = [
  "Moods",
  "😂",
  "🤬",
  "😭",
  "🤩",
  "🤪",
  "Animals",
  "🐨",
  "🐶",
  "🐰",
  "🐻‍❄️",
  "🐷",
  "Fruits",
  "🍎",
  "🍋",
  "🍉",
  "🍒",
  "🍑",
  "Sports",
  "⚽️",
  "🏈",
  "🏀",
  "⚾️",
  "🎱"
];

const App = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 24
  });

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
              {emojis[index]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

render(<App />, document.getElementById("root"));
