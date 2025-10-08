import tokens from "@/tokens";

import { actionSheetVariants, actionSheetSizes } from "./actionSheet";

describe("actionSheet adapter", () => {
  test("exports all variants of the actionSheet", () => {
    expect(actionSheetVariants).toEqual(
      Object.keys(tokens.components.molecules.actionSheet)
    );
  });

  test("exports sizes for variant default", () => {
    expect(actionSheetSizes).toEqual(
      Object.keys(tokens.components.molecules.actionSheet.default)
    );
  });
});
