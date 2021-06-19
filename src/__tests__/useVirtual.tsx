import { render as tlRender, fireEvent } from "@testing-library/react";

import { Options, Return } from "../types";
import useVirtual from "../useVirtual";

type Props = Partial<Options> & { children: (obj: Return) => null };

const Compo = ({ children, itemCount = 10, ...options }: Props) => {
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
        {children({ outerRef, innerRef, items, ...rest })}
      </div>
    </div>
  );
};

const rect = { width: 300, height: 300 };
const mockResizeObserver = jest.fn((cb) => ({
  observe: () => cb([{ contentRect: rect }]),
  disconnect: () => null,
}));

const render = () => {
  let obj: Return;

  tlRender(
    <Compo>
      {(o) => {
        obj = o;
        return null;
      }}
    </Compo>
  );

  // @ts-expect-error
  return { ...obj, getLatestItems: () => obj.items };
};

describe("useVirtual", () => {
  beforeAll(() => {
    // @ts-expect-error
    // eslint-disable-next-line compat/compat
    window.ResizeObserver = mockResizeObserver;
  });

  describe("items", () => {
    const item = {
      index: 0,
      start: 0,
      size: 50,
      isScrolling: undefined,
      isSticky: undefined,
      width: rect.width,
      measureRef: expect.any(Function),
    };

    it("should return correctly", () => {
      const { items } = render();
      const len = 7;
      expect(items).toHaveLength(len);
      expect(items[0]).toEqual(item);
      expect(items[len - 1]).toEqual({ ...item, index: len - 1, start: 300 });
    });

    it("should return correctly while scrolling", () => {
      const { outerRef, getLatestItems } = render();

      fireEvent.scroll(outerRef.current, { target: { scrollTop: 50 } });
      let len = 8;
      let items = getLatestItems();
      expect(items).toHaveLength(len);
      expect(items[0]).toEqual(item);
      expect(items[len - 1]).toEqual({ ...item, index: len - 1, start: 350 });

      fireEvent.scroll(outerRef.current, { target: { scrollTop: 75 } });
      len = 9;
      items = getLatestItems();
      expect(items).toHaveLength(len);
      expect(items[0]).toEqual(item);
      expect(items[len - 1]).toEqual({ ...item, index: len - 1, start: 400 });

      fireEvent.scroll(outerRef.current, { target: { scrollTop: 200 } });
      len = 7;
      items = getLatestItems();
      expect(items).toHaveLength(len);
      expect(items[0]).toEqual({ ...item, index: 3 });
      expect(items[len - 1]).toEqual({ ...item, index: 9, start: 300 });
    });
  });
});
