import tokens from "@/tokens";

import {
  formWrapperVariants,
  formWrapperSizes,
  formWrapperModes,
  formWrapperTones,
} from "./formWrapper";

describe("formWrapper adapter", () => {
  test("exports all variants of the formWrapper", () => {
    expect(formWrapperVariants).toEqual(
      Object.keys(tokens.components.molecules.formWrapper)
    );
  });

  test("exports sizes for variant default", () => {
    expect(formWrapperSizes).toEqual(
      Object.keys(tokens.components.molecules.formWrapper.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(formWrapperModes).toEqual(
      Object.keys(tokens.themes.light.components.molecules.formWrapper)
    );
  });

  test("exports tones for neutral", () => {
    expect(formWrapperTones).toEqual(
      Object.keys(tokens.themes.light.components.molecules.formWrapper.neutral)
    );
  });
});
