import spacing from "@/tokens/src/tokens/spacing.json";

import { abstractSpacings } from "./spacing";

describe("abstractSpacing adapter", () => {
  test("exports abstractSpacings from the tokens spacing", () => {
    expect(abstractSpacings).toEqual(Object.keys(spacing));
  });
});
