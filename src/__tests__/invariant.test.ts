import invariant from "../invariant";

describe("invariant", () => {
  it("should work correctly", () => {
    const message = "Oops!";
    expect(() => invariant(true, message)).toThrow(message);
    expect(() => invariant(false, message)).not.toThrow();

    // @ts-expect-error
    global.__DEV__ = false;
    expect(() => invariant(true, message)).not.toThrow();
  });
});
