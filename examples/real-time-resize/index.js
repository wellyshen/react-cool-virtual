/* eslint-disable jsx-a11y/accessible-emoji */

import { render } from "react-dom";

import Row from "./Row";
import Column from "./Column";
import Grid from "./Grid";
import "./styles.scss";

const getSizes = (min) =>
  new Array(1000).fill().map(() => min + Math.round(Math.random() * 100));

const App = () => (
  <div className="app">
    <p>
      💡 CodeSandbox might be <b>caching the old version</b> of React Cool
      Virtual. You can <b>manually specify to the latest version</b> to see the
      examples.
    </p>
    <br />
    <h4>Row</h4>
    <Row rowHeights={getSizes(35)} />
    <br />
    <br />
    <h4>Column</h4>
    <Column colWidths={getSizes(75)} />
    <br />
    <br />
    <h4>Grid</h4>
    <Grid rowHeights={getSizes(35)} colWidths={getSizes(100)} />
    <br />
    <br />
  </div>
);

render(<App />, document.getElementById("root"));
