/* eslint-disable jsx-a11y/accessible-emoji */

import { render } from "react-dom";

import Skeleton from "./Skeleton";
import General from "./General";
import "./styles.scss";

const App = () => (
  <div className="app">
    <p>
      💡 CodeSandbox might be caching the wrong version of React Cool Virtual.
      You can manually specify to the latest version to see the examples.
    </p>
    <br />
    <h4>Skeleton</h4>
    <Skeleton />
    <br />
    <br />
    <h4>General</h4>
    <General />
    <br />
  </div>
);

render(<App />, document.getElementById("root"));
