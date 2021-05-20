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

// const mockData: any[] = [];
const itemLoadedArr: any = [];

export default (): JSX.Element => {
  const [mockData, setMockData] = useState<any[]>(getMockData(100));
  const { outerRef, innerRef, items } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    itemCount: mockData.length,
    keyExtractor: () => uuidv4(),
    isItemLoaded: (idx) => itemLoadedArr[idx],
    /* loadMore: async ({ batchIndex }) => {
      console.log("LOG ===> Load More...");

      itemLoadedArr[batchIndex] = true;

      try {
        await sleep(2500);
        setMockData((prevData) => [...prevData, ...getMockData(16)]);
      } catch (err) {
        itemLoadedArr[batchIndex] = false;
      }
    }, */
    loadMore: (opts) => console.log("LOG ===> ", opts),
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
              items.map(({ key, index, size, measureRef }: any) => (
                <div
                  key={index}
                  css={[item, index % 2 && itemDark]}
                  style={{ height: `${size}px` }}
                  // ref={measureRef}
                >
                  {index}
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
