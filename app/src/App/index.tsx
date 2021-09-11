/* import { Fragment, useState } from "react";
import useVirtual from "react-cool-virtual";
import { v4 as uuidv4 } from "uuid";

import "normalize.css";
import styles from "./styles.module.scss";

const sleep = (time: number) =>
  // eslint-disable-next-line compat/compat
  new Promise((resolve) => setTimeout(resolve, time));

const getMockData = (count: number, min = 25) =>
  // eslint-disable-next-line no-plusplus
  new Array(count).fill({}).map((_, idx) => ({
    text: uuidv4(),
    size: min + Math.round(Math.random() * 100),
  }));

const rowHeights = getMockData(100000);
const colWidths = getMockData(100000, 75);

export default (): JSX.Element => {
  const [sz, setSz] = useState(25);
  const row = useVirtual<HTMLDivElement, HTMLDivElement>({
    itemCount: rowHeights.length,
    // overscanCount: 0,
  });
  const col = useVirtual<HTMLDivElement, HTMLDivElement>({
    horizontal: true,
    itemCount: colWidths.length,
    // overscanCount: 0,
  });

  return (
    <div className={styles.app}>
      <div
        className={styles.outer}
        ref={(el) => {
          row.outerRef.current = el;
          col.outerRef.current = el;
        }}
      >
        <div
          style={{ position: "relative" }}
          ref={(el) => {
            row.innerRef.current = el;
            col.innerRef.current = el;
          }}
        >
          {row.items.map((rowItem) => (
            <Fragment key={rowItem.index}>
              {col.items.map((colItem) => (
                <div
                  key={colItem.index}
                  className={`${styles.item} ${
                    // eslint-disable-next-line no-nested-ternary
                    rowItem.index % 2
                      ? colItem.index % 2
                        ? styles.dark
                        : ""
                      : !(colItem.index % 2)
                      ? styles.dark
                      : ""
                  }`}
                  style={{
                    position: "absolute",
                    height: `${rowHeights[rowItem.index].size}px`,
                    width: `${colWidths[colItem.index].size}px`,
                    // height: `${
                    //   rowItem.index ? rowHeights[rowItem.index].size : sz
                    // }px`,
                    // width: `${
                    //   colItem.index ? colWidths[colItem.index].size : sz
                    // }px`,
                    transform: `translateX(${colItem.start}px) translateY(${rowItem.start}px)`,
                  }}
                  ref={(el) => {
                    rowItem.measureRef(el);
                    colItem.measureRef(el);
                  }}
                >
                  {rowItem.index}, {colItem.index}
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setSz((prev) => (prev === 25 ? 250 : 25))}
      >
        Resize
      </button>
    </div>
  );
}; */

import { useState } from "react";
import useVirtual from "react-cool-virtual";
import { v4 as uuidv4 } from "uuid";

import "normalize.css";
import styles from "./styles.module.scss";

const getMockData = (count: number, min = 50) =>
  // eslint-disable-next-line no-plusplus
  new Array(count).fill({}).map((_, idx) => ({
    id: uuidv4(),
    text: idx,
    size: min + Math.round(Math.random() * 200),
  }));

const mockData = [
  { id: "layer:1b3346f8-7f9f-4bfc-85cb-4ae4c9b21915", text: "CA 1 Bn PH 4B" },
  { id: "layer:3aadfa7a-e16d-4bbc-8048-591452fb90b2", text: "CA 1Inf Bn" },
  { id: "layer:62bf52ef-65fb-4014-8f69-0cf5a4dd132f", text: "CA 2Inf Bn" },
  { id: "layer:e58106a3-be8a-4b12-80d3-e067ab93efcf", text: "CA 3 Bn PH 4B" },
  { id: "layer:15389114-f9c8-4c0e-aa50-51f5b11128a5", text: "CA 3Inf Bn" },
  { id: "layer:268cf2d7-0a76-4e5f-b519-83dbb3e34852", text: "CA 4 Bn PH 4B" },
  { id: "layer:db040e85-d63c-424b-b616-4f3f89bd43da", text: "CA 4Inf BN" },
  { id: "layer:8abfe595-591b-444d-9793-37aac82c3c71", text: "CA 5 Bn PH 4B" },
  { id: "layer:502d55f4-7e39-4efd-92ee-4548a1c52942", text: "CA 5Inf Bn" },
  { id: "layer:8619644d-270b-4447-89f9-eb2020fe18b5", text: "CA 6 Bn PH 4B" },
  { id: "layer:d15bc45c-b129-4db7-8ba8-0e8a346d7fd3", text: "CA 6Inf Bn" },
  { id: "layer:5a372d86-8657-4946-b8a2-3dd8a7cd1f5a", text: "CA 7Bn PH 4B" },
  { id: "layer:a92c4e27-0193-44de-8bf2-c77f5fa6a85d", text: "CA 8Bn PH 4B" },
  { id: "layer:0594f093-a56a-474f-baee-e057325d02c4", text: "CA 9Bn PH 4B" },
  { id: "layer:0bd9f685-ad80-4cbe-b71d-d78046de195e", text: "CA 10 BN PH 4A" },
  {
    id: "layer:e6cbf179-acb4-443d-ba58-0f418cd11722",
    text: "CA 10BN Phase 4B",
  },
  { id: "layer:627d976e-ce13-4a0c-ad5d-5478aa57fc65", text: "CA 11 BN PH 4A" },
  {
    id: "layer:0ff5cad9-f8e2-4bf7-8db9-093b3f5cffc5",
    text: "CA 11 BN Phave 4B",
  },
  { id: "layer:6c40ce96-09ca-4a66-8e1d-c17a20227ee6", text: "CA 12 BN PH 4A" },
  {
    id: "layer:fcb4f76b-1227-4b06-b6d6-fadf9b38978f",
    text: "CA 12 BN Phase 4b",
  },
  { id: "layer:56020180-129b-44ad-9a18-b3001c84df48", text: "CA 13 BN PH 4A" },
  {
    id: "layer:73d0f989-0945-4d89-9b35-f1724f8a474b",
    text: "CA 13 BN Phase 4b",
  },
  { id: "layer:d4c0eeb9-20ff-4e2c-8216-041c011ab70b", text: "CA 14 BN PH 4A" },
  {
    id: "layer:18f982e4-cef1-4a5f-af6b-0cd407b0031e",
    text: "CA 14 BN Phase 4B",
  },
  { id: "layer:8cf1901b-6ecd-46c0-9837-42b79896597b", text: "CA 15 BN PH 4A" },
  {
    id: "layer:4d5d97d3-e398-422b-ae60-7b4ab493c6be",
    text: "CA 15 BN Phase 4B",
  },
  {
    id: "layer:0f5d4211-8680-467f-bb56-999c167d6236",
    text: "CA 16 BN Phase 4B",
  },
  {
    id: "layer:7b4a06ea-60cf-40cc-b07e-e8fb34dabe78",
    text: "CA 17 BN Phase 4B",
  },
  {
    id: "layer:86335b59-7774-4995-8d46-f2017235c9ab",
    text: "CA 18 BN Phase 4B",
  },
  {
    id: "layer:a51bd108-4f73-49b2-ac62-4e2b16316592",
    text: "CA Div 2 Rec BN PH 4A",
  },
  { id: "layer:b9899c3b-60af-49a7-a8b5-d7a7a557892f", text: "Default Layer" },
  {
    id: "layer:cfd55f3a-c4d8-4393-af7a-c1c8fc57486b",
    text: "EST Force Laydown",
  },
  { id: "layer:c42be074-d56a-4b5c-b9c5-f8792d63866b", text: "FSCM" },
  { id: "layer:7459c244-6851-4dc0-82a0-09b30c80bb36", text: "Intel" },
  {
    id: "layer:ab9cda59-4c9e-4936-9d76-b86e07fb3762",
    text: "Main Supply Routes",
  },
  { id: "layer:3be689db-b58d-4af5-aea6-b8a41eaf9135", text: "Maritime" },
  {
    id: "layer:589ff423-d67f-4a1c-a36d-aec51777eedc",
    text: "PH 4A  DIV 1 SIGACTS",
  },
  {
    id: "layer:a91caf5a-43a3-4ed0-9cf2-9f516c22cd28",
    text: "PH 4A 1BDE SIGACTS",
  },
  {
    id: "layer:2b626b5a-f919-4d95-806b-1e1731a87af2",
    text: "PH 4A 2BDE SIGACTS",
  },
  {
    id: "layer:ba51ba2d-8e93-44f0-a607-6021d2c6e7fc",
    text: "PH 4A 3BDE SIGACTS",
  },
  {
    id: "layer:4c4314fb-c4c1-4d18-8a2e-95eacbc509fb",
    text: "PH 4A CA DIV1 RecBN",
  },
  {
    id: "layer:df3b6649-2f63-45ca-89a1-777d6cf609e1",
    text: "PH 4A DIV 1 Log",
  },
  {
    id: "layer:f12ba1a3-a1b8-47ba-82c9-962490e7ece9",
    text: "PH 4a DIV 2 LOG",
  },
  {
    id: "layer:4cb7294e-4712-4225-b686-abe1f6e9ae76",
    text: "PH 4A Div 2 SIGACTS",
  },
  {
    id: "layer:973acb59-4559-44cb-ae99-935a0c69ca22",
    text: "Ph 4A FFT Start Positions",
  },
  {
    id: "layer:08c787e7-ca5c-427a-9f62-64fc6079465d",
    text: "PH4A 4 BDE SIGACTS",
  },
  {
    id: "layer:0fa53f46-4766-41dc-afb5-9770ca107b9b",
    text: "Phase 0 Boundaries",
  },
  {
    id: "layer:a19401fc-f522-4b8f-b43a-e684bb12647b",
    text: "Phase 4 B Enemy",
  },
  {
    id: "layer:cd782978-8bb1-4c06-aca3-1a3842697457",
    text: "Phase 4 C Enemy",
  },
  { id: "layer:d05d4009-64df-4159-a6fd-f535d36d1c7b", text: "Phase 4 LCC" },
  {
    id: "layer:ecc700a9-6d73-4c96-8e91-2bf2db5f4a2f",
    text: "PHASE 4A 1 DIV FIRES",
  },
  {
    id: "layer:97d215d4-9c92-4edc-a45f-0cde41c243a6",
    text: "Phase 4a 1 DIV RADARS",
  },
  { id: "layer:d8bcb112-c85d-4003-9889-b3c6a5abeed6", text: "Phase 4A 1DIV" },
  {
    id: "layer:4994da73-b346-4804-9fd4-f82181143a19",
    text: "Phase 4A 1DIV 1-6BN",
  },
  {
    id: "layer:4e4b7aaf-656a-456d-98c2-acc5558c18f0",
    text: "PHASE 4A 1DIV TARGETS",
  },
  { id: "layer:82059aaa-8f25-4c05-85a9-6e2de471c06f", text: "Phase 4A 2 Div" },
  {
    id: "layer:b295f026-593e-48c3-8eb4-61f6249ba47d",
    text: "PHASE 4A 2 DIV RADARS",
  },
  { id: "layer:2373d925-3a51-42a8-99dc-ce09c4802588", text: "Phase 4A 4BDE" },
  {
    id: "layer:e5d6c555-3ab8-477b-9033-fcec2079424c",
    text: "Phase 4A 5 BDE SIGACTS",
  },
  { id: "layer:bd14f025-4b61-4842-9e1a-608e74c1fd1e", text: "Phase 4A 5BDE" },
  {
    id: "layer:9a9afe04-a525-404d-9f0e-f0bed9906b55",
    text: "Phase 4A 6 BDE SIGACTS",
  },
  { id: "layer:26ff072b-99ba-4b55-a3f8-a26cf6ef22ee", text: "Phase 4A Enemy" },
  {
    id: "layer:3b1c22e2-bfbb-4156-9335-a15d4d93d726",
    text: "PHASE 4B 1 DIV RADAR",
  },
  {
    id: "layer:c3edf5cb-fd4b-4c0a-86f2-27557960e4cd",
    text: "Phase 4B 1Mech Bde",
  },
  {
    id: "layer:a1ffc0a9-237a-45fc-8810-ef688c49d746",
    text: "PHASE 4B 2 DIV RADARS",
  },
  { id: "layer:49cd24c8-7750-4d32-a3b4-8925c5da8311", text: "Phase 4B 2DIV" },
  {
    id: "layer:fddcf437-a03d-4784-87cd-8fe3f8dbd99a",
    text: "Phase 4B 2Mech Bde",
  },
  { id: "layer:9fb635ad-ee47-42f0-863a-0fadb9ad7f85", text: "Phase 4B 3 Bde" },
  { id: "layer:83fc6292-ecb7-40a9-a425-383254dcc255", text: "Phase 4B 4 BDE" },
  { id: "layer:79a5afc1-4c38-44de-859c-00bd34fbfec3", text: "Phase 4B 5 BDE" },
  { id: "layer:a045b705-1026-4599-8b3a-d8ab9a503bc7", text: "Phase 4B 6 BDE" },
  {
    id: "layer:dd9748ed-be75-4400-9fe0-d8aceddc7a01",
    text: "Phase 4B FFT Start Pos",
  },
  { id: "layer:360ff6a5-d107-4fb5-9825-3ffcb6452a77", text: "Phase 4B-1Div" },
  { id: "layer:04c0917d-487a-4967-af56-4479e015d36b", text: "Phase 4C 1Div" },
  {
    id: "layer:6c5e63c3-2c3c-416a-82cc-d01d18ae0ee5",
    text: "Phase 4C 1Mec Bde",
  },
  { id: "layer:71b37aff-341e-4a43-8c47-d21299c80185", text: "Phase 4C 2DIV" },
  {
    id: "layer:603477e5-dbd6-45e2-9d3c-1035d042ae84",
    text: "Phase 4C 2Mech Bde",
  },
  { id: "layer:f22eb705-4eac-48b7-9bba-673c80bae7c7", text: "Phase 4C 4 BDE" },
  { id: "layer:b77df6c7-51c0-46f5-ab1e-1b0d9f76a09d", text: "Phase 4C 5 BDE" },
  { id: "layer:51350335-8df7-4196-9575-fd2667d998c5", text: "Phase 4C 6 BDE" },
  { id: "layer:2fb62b2e-37bb-4d24-bb70-61f181d7638d", text: "Unit HQ" },
];

export default (): JSX.Element => {
  const [data, setData] = useState(mockData);
  const { outerRef, innerRef, items } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({
    itemCount: data.length,
    resetScroll: true,
  });

  const handleChange = ({ target }: any) => {
    const nextData = mockData.filter(({ text }) =>
      text.toLowerCase().includes(target.value.toLowerCase())
    );

    setData(nextData);
  };

  /* const handleChange = ({ target }: any) => {
    setData(getMockData(parseInt(target.value, 10)));
  }; */

  return (
    <div className={styles.app}>
      <input
        type="text"
        placeholder="filter..."
        onChange={handleChange}
        style={{ width: "80%" }}
      />
      <div className={styles.outer} ref={outerRef}>
        <div ref={innerRef}>
          {items.map(({ index, measureRef }) =>
            data[index] ? (
              <div
                key={data[index].id}
                className={`${styles.item} ${index % 2 ? styles.dark : ""}`}
                style={{ height: "50px" }}
                // style={{ height: `${data[index].size}px` }}
                ref={measureRef}
              >
                {data[index].text}
              </div>
            ) : null
          )}
        </div>
      </div>
      {/* <select onChange={handleChange}>
        <option value="1000">1000</option>
        <option value="10">10</option>
      </select> */}
    </div>
  );
};
