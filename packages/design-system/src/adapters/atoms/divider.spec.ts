import tokens from "@/tokens";

import {
  dividerVariants,
  dividerSizes,
  dividerModes,
  dividerTones,
} from "./divider";

describe("divider adapter", () => {
  test("exports all variants of the divider", () => {
    expect(dividerVariants).toEqual(
      Object.keys(tokens.components.atoms.divider)
    );
  });

  test("exports sizes for variant default", () => {
    expect(dividerSizes).toEqual(
      Object.keys(tokens.components.atoms.divider.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(dividerModes).toEqual(
      Object.keys(tokens.themes.light.components.atoms.divider)
    );
  });

  test("exports tones for neutral", () => {
    expect(dividerTones).toEqual(
      Object.keys(tokens.themes.light.components.atoms.divider.neutral)
    );
  });
});
