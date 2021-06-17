import { render as tlRender } from "@testing-library/react";

import { Options, Return } from "../types";
import { createRo } from "../utils";
import useVirtual from "../useVirtual";

type Obj = Omit<Return, "outerRef" | "innerRef">;

type Props = Partial<Options> & { children: (obj: Obj) => null };

const Compo = ({ children, itemCount = 100, ...options }: Props) => {
  const { outerRef, innerRef, items, ...rest } = useVirtual<
    HTMLDivElement,
    HTMLDivElement
  >({ itemCount, ...options });

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

  describe("items", () => {
    it("should return `items` correctly", () => {
      const { items } = render();

      const len = 7;
      expect(items).toHaveLength(7);

      const item = {
        index: 0,
        start: 0,
        size: 50,
        isScrolling: undefined,
        isSticky: undefined,
        width: rect.width,
        measureRef: expect.any(Function),
      };
      expect(items[0]).toEqual(item);
      expect(items[len - 1]).toEqual({ ...item, index: len - 1, start: 300 });
    });
  });
});
