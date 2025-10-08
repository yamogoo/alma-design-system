import colors from "@/tokens";

import { abstractColors } from "./color";

describe("abstracSurface adapter", () => {
  test("exports colors from the light theme", () => {
    expect(abstractColors).toEqual(colors);
  });
});
