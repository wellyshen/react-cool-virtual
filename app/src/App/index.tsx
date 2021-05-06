/** @jsxImportSource @emotion/react */

import { Global, css } from "@emotion/react";
import useVirtual from "react-cool-virtual";
import normalize from "normalize.css";

import { root, app, container, item, itemDark } from "./styles";

const getMockData = (count: number) =>
  // eslint-disable-next-line no-plusplus
  new Array(count).fill({}).map((_, idx) => ({ id: idx++, text: idx++ }));

export default (): JSX.Element => {
  const mockData = getMockData(1000);
  const { containerRef, items } = useVirtual<HTMLDivElement>({
    itemData: getMockData(10),
    itemCount: 20,
    itemSize: 100,
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
        <div css={container} ref={containerRef}>
          {items.map(({ data, index, ref }: any) => (
            <div key={index} css={[item, !(index % 2) && itemDark]} ref={ref}>
              {data ? data.text : "Loading..."}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
