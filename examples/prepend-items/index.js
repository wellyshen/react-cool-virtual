/* eslint-disable jsx-a11y/accessible-emoji */

import { render } from "react-dom";

import Skeleton from "./Skeleton";
import Indicator from "./Indicator";
import "./styles.scss";

const App = () => (
  <div className="app">
    <p>
      💡 CodeSandbox might be <b>caching the old version</b> of React Cool
      Virtual. You can <b>manually specify to the latest version</b> to see the
      examples.
    </p>
    <br />
    <h4>Skeleton</h4>
    <Skeleton />
    <br />
    <br />
    <h4>Indicator</h4>
    <Indicator />
    <br />
    <br />
  </div>
);

render(<App />, document.getElementById("root"));
