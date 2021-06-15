/* eslint-disable compat/compat */

import { now } from "../utils";

describe("now", () => {
  it("should work correctly", () => {
    performance.now = jest.fn();
    now();
    expect(performance.now).toHaveBeenCalled();

    // @ts-expect-error
    delete window.performance;
    Date.now = jest.fn();
    now();
    expect(Date.now).toHaveBeenCalled();
  });
});
