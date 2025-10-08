import tokens from "@/tokens";

import { sheetVariants, sheetSizes } from "./sheet";

describe("sheet adapter", () => {
  test("exports all variants of the formWrapper", () => {
    expect(sheetVariants).toEqual(
      Object.keys(tokens.components.molecules.sheet)
    );
  });

  test("exports sizes for variant default", () => {
    expect(sheetSizes).toEqual(
      Object.keys(tokens.components.molecules.sheet.default)
    );
  });
});
