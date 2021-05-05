import { css } from "@emotion/react";

export const root = css`
  body {
    font-family: "Roboto", sans-serif;
  }
`;

export const app = css`
  margin-top: 3rem;
`;

export const container = css`
  margin: 0 auto;
  width: 300px;
  height: 300px;
  border: 1px solid #000;
  overflow-y: auto;
  background: greenyellow;
`;

export const item = css`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background: #fff;
`;

export const itemDark = css`
  background: #ccc;
`;
