/* eslint-disable jsx-a11y/accessible-emoji */

import useVirtual from "react-cool-virtual";

import "./styles.scss";

const BuiltIn = () => {
  const { outerRef, innerRef, items, scrollToItem } = useVirtual({
    itemCount: 10000,
    // In 500 milliseconds
    scrollDuration: 500,
    // Using "easeInOutBack" effect, see: https://easings.net/#easeInOutBack
    scrollEasingFunction: (t) => {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;

      return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    }
  });

  return (
    <>
      <button
        onClick={() =>
          scrollToItem({
            index: Math.floor(Math.random() * 10000),
            smooth: true // Turn on smoothing scrolling feature
          })
        }
      >
        Scroll to...
      </button>
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
    </>
  );
};

export default BuiltIn;
