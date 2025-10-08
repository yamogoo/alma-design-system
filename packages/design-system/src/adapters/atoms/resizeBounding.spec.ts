import tokens from "@/tokens";

import {
  resizeBoundingVariants,
  resizeBoundingSizes,
  resizeBoundingModes,
  resizeBoundingTones,
} from "./resizeBounding";

describe("resizeBounding adapter", () => {
  test("exports all variants of the resizeBounding", () => {
    expect(resizeBoundingVariants).toEqual(
      Object.keys(tokens.components.atoms.resizeBounding)
    );
  });

  test("exports sizes for variant default", () => {
    expect(resizeBoundingSizes).toEqual(
      Object.keys(tokens.components.atoms.resizeBounding.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(resizeBoundingModes).toEqual(
      Object.keys(tokens.themes.light.components.atoms.resizeBounding)
    );
  });

  test("exports tones for accent", () => {
    expect(resizeBoundingTones).toEqual(
      Object.keys(tokens.themes.light.components.atoms.resizeBounding.accent)
    );
  });
});
