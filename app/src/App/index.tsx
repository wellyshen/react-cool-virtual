/** @jsxImportSource @emotion/react */

import { useState, useReducer } from "react";
import { Global, css } from "@emotion/react";
import useVirtual from "react-cool-virtual";
import { v4 as uuidv4 } from "uuid";

import normalize from "normalize.css";

import { root, app, outer, inner, item, itemDark } from "./styles";

const getMockData = (count: number) =>
  // eslint-disable-next-line no-plusplus
  new Array(count).fill({}).map((_, idx) => ({
    text: uuidv4(),
    size: 25 + Math.round(Math.random() * 100),
  }));

const mockData: any[] = [];
const itemLoadedArr: any = [];

export default (): JSX.Element => {
  const [, forceUpdate] = useReducer((c) => c + 1, 0);
  // const [mockData, setMockData] = useState<any[]>([]);
  const { outerRef, innerRef, items } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    itemCount: 1000,
    // itemSize: 100,
    isItemLoaded: (idx) => itemLoadedArr[idx],
    loadMore: async ({ loadIndex, startIndex, stopIndex }) => {
      itemLoadedArr[loadIndex] = true;

      try {
        // eslint-disable-next-line compat/compat
        await new Promise((resolve) => setTimeout(resolve, 2500));
        for (let i = startIndex; i <= stopIndex; i += 1) mockData[i] = true;
        forceUpdate();
      } catch (err) {
        itemLoadedArr[loadIndex] = false;
      }
    },
    // loadMoreThreshold: 10,
    // loadMore: (opts) => console.log("LOG ===> ", opts),
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
            {items.length ? (
              items.map(({ index, size, measureRef }: any) => (
                <div
                  key={index}
                  css={[item, index % 2 && itemDark]}
                  style={{ height: `${size}px` }}
                  // ref={measureRef}
                >
                  {mockData[index] ? index : "Loading..."}
                </div>
              ))
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
