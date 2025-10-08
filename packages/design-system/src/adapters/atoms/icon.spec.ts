import tokens from "@/tokens";

import {
  iconVariants,
  iconSizes,
  iconModes,
  iconTones,
  iconStates,
} from "./icon";

describe("icon adapter", () => {
  test("exports all variants of the icon", () => {
    expect(iconVariants).toEqual(Object.keys(tokens.components.atoms.icon));
  });

  test("exports sizes for variant default", () => {
    expect(iconSizes).toEqual(
      Object.keys(tokens.components.atoms.icon.default)
    );
  });

  test("exports modes from the light theme (contracts.interactive.label)", () => {
    expect(iconModes).toEqual(
      Object.keys(tokens.themes.light.contracts.interactive.label)
    );
  });

  test("exports tones for neutral", () => {
    expect(iconTones).toEqual(
      Object.keys(tokens.themes.light.contracts.interactive.label.neutral)
    );
  });

  test("exports tones for primary", () => {
    expect(iconStates).toEqual(
      Object.keys(
        tokens.themes.light.contracts.interactive.label.neutral.primary
      )
    );
  });
});
