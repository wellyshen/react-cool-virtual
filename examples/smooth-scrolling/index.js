/* eslint-disable jsx-a11y/accessible-emoji */

import { render } from "react-dom";

import BuiltIn from "./BuiltIn";
import Customized from "./Customized";
import "./styles.scss";

const App = () => (
  <div className="app">
    <p>
      💡 CodeSandbox might be caching the wrong version of React Cool Virtual.
      You can manually specify to the latest version to see the examples.
    </p>
    <br />
    <h4>Built-in (easeInOutCubic)</h4>
    <BuiltIn />
    <br />
    <br />
    <h4>Customized (easeInOutBack)</h4>
    <Customized />
  </div>
);

render(<App />, document.getElementById("root"));
