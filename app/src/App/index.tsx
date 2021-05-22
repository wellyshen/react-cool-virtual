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
  const [mockData, setMockData] = useState<any[]>(getMockData(1000));
  const { outerRef, innerRef, items, scrollToItem } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    itemCount: mockData.length,
    // itemSize: (_, width) => (width > 500 ? 100 : 50),
    // keyExtractor: () => uuidv4(),
    /* isItemLoaded: (idx) => itemLoadedArr[idx],
    loadMore: async ({ loadIndex }) => {
      itemLoadedArr[loadIndex] = true;
      // if (loadIndex === 3) itemLoadedArr[loadIndex + 1] = true;
      await sleep(2500);
      setMockData((prev) => [...prev, ...getMockData(15)]);
    }, */
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
              items.map(({ key, index, size, measureRef }) => (
                <div
                  key={index}
                  css={[item, index % 2 && itemDark]}
                  style={{ height: `${mockData[index].size}px` }}
                  ref={measureRef}
                >
                  {index}
                </div>
              ))
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            scrollToItem({ index: 500, smooth: false, autoCorrect: true }, () =>
              console.log("Done!")
            )
          }
        >
          Scroll To
        </button>
      </div>
    </>
  );
};
