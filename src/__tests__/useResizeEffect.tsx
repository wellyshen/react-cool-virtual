/* eslint-disable react/require-default-props */

import { RefObject, useState } from "react";
import { render, fireEvent, screen } from "@testing-library/react";

import { OnResize } from "../types";
import { useResizeEffect } from "../utils";

interface Props {
  el?: RefObject<HTMLDivElement>;
  cb?: OnResize;
}

const Compo = ({
  el = { current: document.createElement("div") },
  cb = () => null,
}: Props) => {
  const [dep, setDep] = useState(50);
  useResizeEffect(el, cb, [dep]);

  return (
    <button data-testid="btn" type="button" onClick={() => setDep(100)}>
      Change Dep
    </button>
  );
};

const contentRect = { width: 100, height: 100 };
const observe = jest.fn();
const disconnect = jest.fn();
const mockResizeObserver = jest.fn((cb) => ({
  observe: () => {
    cb([{ contentRect }]);
    observe();
  },
  disconnect,
}));

describe("useResizeEffect", () => {
  beforeEach(() => jest.clearAllMocks());

  beforeAll(() => {
    // @ts-expect-error
    // eslint-disable-next-line compat/compat
    window.ResizeObserver = mockResizeObserver;
  });

  it("should not trigger callback", () => {
    let cb = jest.fn();
    // @ts-expect-error
    render(<Compo el={null} cb={cb} />);
    expect(cb).not.toHaveBeenCalled();

    cb = jest.fn();
    render(<Compo el={{ current: null }} cb={cb} />);
    expect(cb).not.toHaveBeenCalled();
  });

  it("should trigger callback correctly", () => {
    const cb = jest.fn();
    render(<Compo cb={cb} />);
    expect(cb).toHaveBeenCalledWith(contentRect);
  });

  it("should re-observe when dependencies changed", () => {
    render(<Compo />);
    expect(observe).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId("btn"));
    expect(observe).toHaveBeenCalledTimes(2);
  });

  it("should destroy observe when unmounted", () => {
    const { unmount } = render(<Compo />);
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
