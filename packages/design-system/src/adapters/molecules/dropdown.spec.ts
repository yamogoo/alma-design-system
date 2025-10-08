import tokens from "@/tokens";

import {
  dropdownVariants,
  dropdownSizes,
  dropdownModes,
  dropdownTones,
} from "./dropdown";

describe("dropdown adapter", () => {
  test("exports all variants of the dropdown", () => {
    expect(dropdownVariants).toEqual(
      Object.keys(tokens.components.molecules.dropdown)
    );
  });

  test("exports sizes for variant default", () => {
    expect(dropdownSizes).toEqual(
      Object.keys(tokens.components.molecules.dropdown.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(dropdownModes).toEqual(
      Object.keys(tokens.themes.light.components.molecules.dropdown)
    );
  });

  test("exports tones for neutral", () => {
    expect(dropdownTones).toEqual(
      Object.keys(tokens.themes.light.components.molecules.dropdown.neutral)
    );
  });
});
