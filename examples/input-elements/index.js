/* eslint-disable jsx-a11y/accessible-emoji */

import { useState } from "react";
import { render } from "react-dom";
import useVirtual from "react-cool-virtual";

import "./styles.scss";

const defaultValues = new Array(20).fill(false);

const App = () => {
  const [formData, setFormData] = useState({ todo: defaultValues });
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: defaultValues.length
  });

  const handleInputChange = ({ target }, index) => {
    // Store the input values in React state
    setFormData((prevData) => {
      const todo = [...prevData.todo];
      todo[index] = target.checked;
      return { todo };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(formData, undefined, 2));
  };

  return (
    <div className="app">
      <p>
        💡 CodeSandbox might be <b>caching the old version</b> of React Cool
        Virtual. You can <b>manually specify to the latest version</b> to see
        the examples.
      </p>
      <br />
      <form onSubmit={handleSubmit}>
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
                <input
                  id={`todo-${index}`}
                  type="checkbox"
                  // Populate the corresponding state to the default value
                  defaultChecked={formData.todo[index]}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <label htmlFor={`todo-${index}`}>{index}. I'd like to...</label>
              </div>
            ))}
          </div>
        </div>
        <input type="submit" />
      </form>
    </div>
  );
};

render(<App />, document.getElementById("root"));
