import { render } from "react-dom";

import Row from "./Row";
import Column from "./Column";
import Grid from "./Grid";
import "./styles.scss";

const App = () => (
  <div className="app">
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
