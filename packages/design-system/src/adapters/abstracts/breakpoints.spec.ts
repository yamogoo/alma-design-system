import breakpoints from "@/tokens/src/breakpoints.json";

import { abstractBreakpoints } from "./breakpoints";

describe("abstractBreakpoints adapter", () => {
  test("exports breakpoints from the breakpoints", () => {
    expect(abstractBreakpoints).toEqual(Object.keys(breakpoints));
  });
});
