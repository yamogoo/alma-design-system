import tokens from "@/tokens";

import {
  switchVariants,
  switchSizes,
  switchModes,
  switchTones,
} from "./switch";

describe("switch adapter", () => {
  test("exports all variants of the switch", () => {
    expect(switchVariants).toEqual(Object.keys(tokens.components.atoms.switch));
  });

  test("exports sizes for variant default", () => {
    expect(switchSizes).toEqual(
      Object.keys(tokens.components.atoms.switch.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(switchModes).toEqual(
      Object.keys(tokens.themes.light.components.atoms.switch)
    );
  });

  test("exports tones for neutral", () => {
    expect(switchTones).toEqual(
      Object.keys(tokens.themes.light.components.atoms.switch.neutral)
    );
  });
});
