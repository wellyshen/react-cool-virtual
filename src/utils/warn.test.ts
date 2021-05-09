import warn from "./warn";

describe("warn", () => {
  it("should work correctly", () => {
    console.warn = jest.fn();
    warn("🍎", "🍋");
    expect(console.warn).toHaveBeenCalledWith("🍎", "🍋");

    console.warn = jest.fn();
    // @ts-expect-error
    global.__DEV__ = false;
    warn("🍎", "🍋");
    expect(console.warn).not.toHaveBeenCalled();
  });
});
