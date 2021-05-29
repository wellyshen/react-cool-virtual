/* eslint-disable jsx-a11y/accessible-emoji */

import useVirtual from "react-cool-virtual";

import "./styles.scss";

const Customized = () => {
  const { outerRef, innerRef, items, scrollToItem } = useVirtual({
    itemCount: 10000
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

export default Customized;
