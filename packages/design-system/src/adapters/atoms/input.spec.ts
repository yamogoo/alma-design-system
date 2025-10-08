import tokens from "@/tokens";

import { inputVariants, inputSizes, inputModes, inputTones } from "./input";

describe("input adapter", () => {
  test("exports all variants of the input", () => {
    expect(inputVariants).toEqual(Object.keys(tokens.components.atoms.input));
  });

  test("exports sizes for variant default", () => {
    expect(inputSizes).toEqual(
      Object.keys(tokens.components.atoms.input.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(inputModes).toEqual(
      Object.keys(tokens.themes.light.components.atoms.input)
    );
  });

  test("exports tones for neutral", () => {
    expect(inputTones).toEqual(
      Object.keys(tokens.themes.light.components.atoms.input.neutral)
    );
  });
});
