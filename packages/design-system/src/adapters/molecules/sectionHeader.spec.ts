import tokens from "@/tokens";

import { sectionHeaderVariants, sectionHeaderSizes } from "./sectionHeader";

describe("sectionHeader adapter", () => {
  test("exports all variants of the sectionHeader", () => {
    expect(sectionHeaderVariants).toEqual(
      Object.keys(tokens.components.molecules.sectionHeader)
    );
  });

  test("exports sizes for variant default", () => {
    expect(sectionHeaderSizes).toEqual(
      Object.keys(tokens.components.molecules.sectionHeader.default)
    );
  });
});
