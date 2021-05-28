/* eslint-disable jsx-a11y/accessible-emoji */

import { render } from "react-dom";

import Row from "./Row";
import Column from "./Column";
import Grid from "./Grid";
import "./styles.scss";

const App = () => (
  <div className="app">
    <p>
      💡 CodeSandbox might be caching the wrong version of React Cool Virtual.
      You can manually specify to the latest version to see the examples.
    </p>
    <br />
    <h4>Row</h4>
    <Row />
    <br />
    <br />
    <h4>Column</h4>
    <Column />
    <br />
    <br />
    <h4>Grid</h4>
    <Grid />
    <br />
  </div>
);

render(<App />, document.getElementById("root"));
