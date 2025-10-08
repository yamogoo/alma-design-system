import tokens from "@/tokens";

import {
  snackbarVariants,
  snackbarSizes,
  snackbarModes,
  snackbarTones,
} from "./snackbar";

describe("snackbar adapter", () => {
  test("exports all variants of the snackbar", () => {
    expect(snackbarVariants).toEqual(
      Object.keys(tokens.components.molecules.snackbar)
    );
  });

  test("exports sizes for variant default", () => {
    expect(snackbarSizes).toEqual(
      Object.keys(tokens.components.molecules.snackbar.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(snackbarModes).toEqual(
      Object.keys(tokens.themes.light.components.molecules.snackbar)
    );
  });

  test("exports tones for neutral", () => {
    expect(snackbarTones).toEqual(
      Object.keys(tokens.themes.light.components.molecules.snackbar.neutral)
    );
  });
});
