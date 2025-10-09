import tokens from "@/tokens";

import { toolbarGroupVariants, toolbarGroupSizes } from "./toolbarGroup";

describe("toolbarGroup adapter", () => {
  test("exports all variants of the toolbarGroup", () => {
    expect(toolbarGroupVariants).toEqual(
      Object.keys(tokens.components.molecules.toolbarGroup)
    );
  });

  test("exports sizes for variant default", () => {
    expect(toolbarGroupSizes).toEqual(
      Object.keys(tokens.components.molecules.toolbarGroup.default)
    );
  });
});
