/** @jsxImportSource @emotion/react */

import { useState } from "react";
import { Global, css } from "@emotion/react";
import useVirtual from "react-cool-virtual";
import { v4 as uuidv4 } from "uuid";

import normalize from "normalize.css";

import { root, app, outer, inner, item, itemDark } from "./styles";

const sleep = (time: number) =>
  // eslint-disable-next-line compat/compat
  new Promise((resolve) => setTimeout(resolve, time));

const getMockData = (count: number) =>
  // eslint-disable-next-line no-plusplus
  new Array(count).fill({}).map((_, idx) => ({
    text: uuidv4(),
    size: 25 + Math.round(Math.random() * 100),
  }));

const itemLoadedArr: any = [];

export default (): JSX.Element => {
  const {
    outerRef,
    innerRef,
    items: rowItems,
  } = useVirtual<HTMLDivElement, HTMLDivElement>({ itemCount: 100 });

  return (
    <>
      <Global
        styles={css`
          ${normalize}
          ${root}
        `}
      />
      <div css={app}>
        <div css={outer} ref={outerRef}>
          <div css={inner} ref={innerRef}>
            {rowItems.map(({ index, size }) => (
              <div
                key={index}
                css={[item, index % 2 && itemDark]}
                style={{ height: `${size}px` }}
              >
                {index}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
