import tokens from "@/tokens";

import { formVariants, formSizes, formModes, formTones } from "./form";

describe("form adapter", () => {
  test("exports all variants of the form", () => {
    expect(formVariants).toEqual(Object.keys(tokens.components.molecules.form));
  });

  test("exports sizes for variant default", () => {
    expect(formSizes).toEqual(
      Object.keys(tokens.components.molecules.form.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(formModes).toEqual(
      Object.keys(tokens.themes.light.components.molecules.form)
    );
  });

  test("exports tones for neutral", () => {
    expect(formTones).toEqual(
      Object.keys(tokens.themes.light.components.molecules.form.neutral)
    );
  });
});
