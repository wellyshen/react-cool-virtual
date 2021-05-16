/** @jsxImportSource @emotion/react */

import { useState } from "react";
import { Global, css } from "@emotion/react";
import useVirtual from "react-cool-virtual";
import { v4 as uuidv4 } from "uuid";

import normalize from "normalize.css";

import { root, app, outer, inner, item, itemDark } from "./styles";

const getMockData = (count: number) =>
  // eslint-disable-next-line no-plusplus
  new Array(count).fill({}).map((_, idx) => ({
    text: idx,
    // size: 25 + Math.round(Math.random() * 100),
  }));

const mockData = getMockData(1000);

export default (): JSX.Element => {
  const { outerRef, innerRef, items, scrollTo } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    itemData: mockData,
    // itemCount,
    itemSize: 100,
    // itemSize: (idx: number) => [35, 70, 150, 300, 220, 500, 430, 100][idx],
    // horizontal: true,
    // overscanCount: 0,
    // useIsScrolling: true,
    // onScroll: (opts) => console.log("LOG ===> ", opts),
    // scrollingEffect: {
    //   easingFunction: (t) => t,
    // },
  });

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
            {items.map(
              ({ data, index, size, isScrolling, measureRef }: any) => (
                <div
                  key={index}
                  css={[item, !(index % 2) && itemDark]}
                  style={{ height: `${size}px` }}
                  ref={measureRef}
                >
                  {data.text}
                </div>
              )
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => scrollTo({ offset: 50000, smooth: true })}
        >
          Scroll To
        </button>
      </div>
    </>
  );
};
