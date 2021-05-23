import useVirtual from "react-cool-virtual";

import "./styles.scss";

const VerticalList = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: 10000
  });

  return (
    <div
      className="outer"
      style={{ width: "300px", height: "300px", overflow: "auto" }}
      ref={outerRef}
    >
      <div ref={innerRef}>
        {items.map(({ index, size }) => (
          <div
            key={index}
            className={`item ${index % 2 && "light"}`}
            style={{ height: `${size}px` }}
          >
            {index}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerticalList;
