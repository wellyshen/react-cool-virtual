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
    text: uuidv4(),
    size: 25 + Math.round(Math.random() * 100),
  }));

const mockData = getMockData(10000);

export default (): JSX.Element => {
  const [itemCount, setItemCount] = useState(10);
  const { outerRef, innerRef, items, scrollTo, scrollToItem } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    itemCount: 0,
    // itemCount: mockData.length,
    // itemSize: 100,
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
            {items.length ? (
              items.map(({ index, size, isScrolling, measureRef }: any) => (
                <div
                  key={index}
                  css={[item, !(index % 2) && itemDark]}
                  style={{ height: `${size}px` }}
                  ref={measureRef}
                >
                  {mockData[index].text}
                </div>
              ))
            ) : (
              <div>Loading...</div>
            )}
          </div>
        </div>
        <button type="button" onClick={() => setItemCount(20)}>
          Add Items
        </button>
        <button
          type="button"
          onClick={() =>
            scrollToItem({ index: 10000, align: "start", smooth: true }, () =>
              console.log("LOG ===> Done!")
            )
          }
        >
          Scroll To
        </button>
      </div>
    </>
  );
};
