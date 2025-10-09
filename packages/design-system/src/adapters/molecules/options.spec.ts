import tokens from "@/tokens";

import {
  optionsVariants,
  optionsSizes,
  optionsModes,
  optionsTones,
} from "./options";

describe("options adapter", () => {
  test("exports all variants of the options", () => {
    expect(optionsVariants).toEqual(
      Object.keys(tokens.components.molecules.options)
    );
  });

  test("exports sizes for variant default", () => {
    expect(optionsSizes).toEqual(
      Object.keys(tokens.components.molecules.options.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(optionsModes).toEqual(
      Object.keys(tokens.themes.light.components.molecules.options)
    );
  });

  test("exports tones for neutral", () => {
    expect(optionsTones).toEqual(
      Object.keys(tokens.themes.light.components.molecules.options.neutral)
    );
  });
});
