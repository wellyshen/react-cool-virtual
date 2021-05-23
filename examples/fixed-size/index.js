import { render } from "react-dom";

import VerticalList from "./VerticalList";
import HorizontalList from "./HorizontalList";
import Table from "./Table";
import "./styles.scss";

const App = () => (
  <div className="app">
    <h4>Vertical List</h4>
    <VerticalList />
    <br />
    <br />
    <h4>Horizontal List</h4>
    <HorizontalList />
    <br />
    <br />
    <h4>Table</h4>
    <Table />
    <br />
  </div>
);

render(<App />, document.getElementById("root"));
