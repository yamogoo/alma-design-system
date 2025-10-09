import tokens from "@/tokens";

import { groupVariants, groupSizes, groupModes, groupTones } from "./group";
import { surfaceModes, surfaceTones } from "@/adapters/atoms/surface";

describe("group adapter", () => {
  test("exports all variants of the group", () => {
    expect(groupVariants).toEqual(
      Object.keys(tokens.components.molecules.group)
    );
  });

  test("exports sizes for variant default", () => {
    expect(groupSizes).toEqual(
      Object.keys(tokens.components.molecules.group.default)
    );
  });

  test("exports modes from the surface modes", () => {
    expect(groupModes).toEqual(surfaceModes);
  });

  test("exports tones from surface tones", () => {
    expect(groupTones).toEqual(surfaceTones);
  });
});
