import { css } from "@emotion/react";

export const root = css`
  body {
    font-family: "Roboto", sans-serif;
  }
`;

export const app = css`
  margin-top: 3rem;
  text-align: center;
`;

export const outer = css`
  margin: 0 auto;
  width: 300px;
  height: 300px;
  border: 1px solid #000;
  margin-bottom: 1rem;
  overflow: auto;
`;

export const inner = css`
  display: block;
`;

export const item = css`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
`;

export const itemDark = css`
  background: #ccc;
`;
