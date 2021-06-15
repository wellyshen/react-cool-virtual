import { render as tlRender } from "@testing-library/react";

import { Return } from "../types";
import { createRo } from "../utils";
import useVirtual from "../useVirtual";

type Obj = Omit<Return, "outerRef" | "innerRef">;

interface Props {
  children: (obj: Obj) => null;
}

const Compo = ({ children }: Props) => {
  const { outerRef, innerRef, items, ...rest } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({ itemCount: 100 });

  return (
    <div ref={outerRef}>
      <div ref={innerRef}>
        {items.map(({ index }) => (
          <div key={index}>{index}</div>
        ))}
        {children({ items, ...rest })}
      </div>
    </div>
  );
};

const itemSize = 50;
const overscanCount = 1;
const rect = { width: 300, height: 300 };
const mockResizeObserver = createRo(rect);

const render = () => {
  let obj: Obj;

  tlRender(
    <Compo>
      {(o) => {
        obj = o;
        return null;
      }}
    </Compo>
  );

  // @ts-expect-error
  return obj;
};

describe("useVirtual", () => {
  beforeAll(() => {
    // @ts-expect-error
    // eslint-disable-next-line compat/compat
    window.ResizeObserver = mockResizeObserver;
  });

  it("should return `items` correctly", () => {
    const { items } = render();
    expect(items).toHaveLength(rect.height / itemSize + overscanCount);
  });
});
