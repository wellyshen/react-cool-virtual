import now from "./now";

describe("now", () => {
  it("should work correctly", () => {
    // @ts-expect-error
    global.performance = undefined;
    // @ts-expect-error
    global.Date = { now: jest.fn() };
    now();
    expect(Date.now).toHaveBeenCalled();

    // @ts-expect-error
    global.performance = { now: jest.fn() };
    now();
    // eslint-disable-next-line compat/compat
    expect(performance.now).toHaveBeenCalled();
  });
});
