/* eslint-disable jsx-a11y/accessible-emoji */

import { render } from "react-dom";

import Form from "./Form";
import RCF from "./RCF";
import "./styles.scss";

const App = () => (
  <div className="app">
    <p>
      💡 CodeSandbox might be <b>caching the old version</b> of React Cool
      Virtual. You can <b>manually specify to the latest version</b> to see the
      examples.
    </p>
    <br />
    <h4>Form</h4>
    <Form />
    <br />
    <br />
    <h4>React Cool Form</h4>
    <RCF />
    <br />
    <br />
  </div>
);

render(<App />, document.getElementById("root"));
