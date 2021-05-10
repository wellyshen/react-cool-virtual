/** @jsxImportSource @emotion/react */

import { Global, css } from "@emotion/react";
import useVirtual from "react-cool-virtual";
import { v4 as uuidv4 } from "uuid";

import normalize from "normalize.css";

import { root, app, outer, inner, item, itemDark } from "./styles";

const getMockData = (count: number) =>
  // eslint-disable-next-line no-plusplus
  new Array(count).fill({}).map((_, idx) => ({ text: idx }));

export default (): JSX.Element => {
  // const mockData = getMockData(1000);
  const { outerRef, innerRef, items } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    itemData: getMockData(10),
    // itemCount: 20,
    itemSize: 100,
    // itemSize: (idx: number) => [35, 70, 150, 300, 220, 500, 430, 100][idx],
    // horizontal: true,
    // defaultItemSize: 100,
    overscanCount: 0,
    onScroll: (opts) => console.log("LOG ===> ", opts),
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
            {items.map(({ data, index, size, measureRef }: any) => (
              <div
                key={index}
                css={[item, !(index % 2) && itemDark]}
                style={{ height: `${size}px` }}
                // ref={measureRef}
              >
                {data.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
