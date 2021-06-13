/* eslint-disable jsx-a11y/accessible-emoji */

import { render } from "react-dom";
import useVirtual from "react-cool-virtual";
import { useForm } from "react-cool-form";

import "./styles.scss";

const defaultValues = new Array(20).fill(false);

const App = () => {
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: defaultValues.length
  });
  const { form } = useForm({
    defaultValues: { todo: defaultValues },
    removeOnUnmounted: false, // To keep the value of unmounted fields
    onSubmit: (formData) => alert(JSON.stringify(formData, undefined, 2))
  });

  return (
    <div className="app">
      <p>
        💡 CodeSandbox might be <b>caching the old version</b> of React Cool
        Virtual. You can <b>manually specify to the latest version</b> to see
        the examples.
      </p>
      <br />
      <form ref={form}>
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
                  name={`todo[${index}]`}
                  type="checkbox"
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
