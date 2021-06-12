/* eslint-disable jsx-a11y/accessible-emoji */

import { render } from "react-dom";

import BuiltIn from "./BuiltIn";
import Customized from "./Customized";
import "./styles.scss";

const App = () => (
  <div className="app">
    <p>
      💡 CodeSandbox might be <b>caching the old version</b> of React Cool
      Virtual. You can <b>manually specify to the latest version</b> to see the
      examples.
    </p>
    <br />
    <h4>Built-in (easeInOutSine)</h4>
    <BuiltIn />
    <br />
    <br />
    <h4>Customized (easeInOutBack)</h4>
    <Customized />
    <br />
    <br />
  </div>
);

render(<App />, document.getElementById("root"));
