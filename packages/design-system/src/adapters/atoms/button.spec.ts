import tokens from "@/tokens";

import {
  buttonVariants,
  buttonSizes,
  buttonModes,
  buttonTones,
} from "./button";

describe("button adapter", () => {
  test("exports all variants of the button", () => {
    expect(buttonVariants).toEqual(Object.keys(tokens.components.atoms.button));
  });

  test("exports sizes for variant default", () => {
    expect(buttonSizes).toEqual(
      Object.keys(tokens.components.atoms.button.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(buttonModes).toEqual(
      Object.keys(tokens.themes.light.components.atoms.button)
    );
  });

  test("exports tones for neutral", () => {
    expect(buttonTones).toEqual(
      Object.keys(tokens.themes.light.components.atoms.button.neutral)
    );
  });
});
