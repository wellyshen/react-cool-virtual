/* eslint-disable jsx-a11y/accessible-emoji */

import { render } from "react-dom";

import FixedSize from "./FixedSize";
import DynamicSize from "./DynamicSize";
import "./styles.scss";

const App = () => (
  <div className="app">
    <p>
      💡 CodeSandbox might be <b>caching the wrong version</b> of React Cool
      Virtual. You can <b>manually specify to the latest version</b> to see the
      examples.
    </p>
    <br />
    <h4>Fixed Size</h4>
    <FixedSize />
    <br />
    <br />
    <h4>Dynamic Size</h4>
    <DynamicSize />
    <br />
    <br />
  </div>
);

render(<App />, document.getElementById("root"));
