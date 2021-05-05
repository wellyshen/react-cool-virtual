import { Global, css } from "@emotion/react";
import normalize from "normalize.css";

import { root } from "./styles";

export default (): JSX.Element => (
  <>
    <Global
      styles={css`
        ${normalize}
        ${root}
      `}
    />
    <h1>Hello World!</h1>
  </>
);
