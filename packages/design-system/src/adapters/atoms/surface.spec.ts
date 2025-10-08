import tokens from "@/tokens";

import {
  surfaceVariants,
  surfaceSizes,
  surfaceModes,
  surfaceTones,
} from "./surface";

describe("surface adapter", () => {
  test("exports all variants of the surface", () => {
    expect(surfaceVariants).toEqual(
      Object.keys(tokens.components.atoms.surface)
    );
  });

  test("exports sizes for variant default", () => {
    expect(surfaceSizes).toEqual(
      Object.keys(tokens.components.atoms.surface.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(surfaceModes).toEqual(
      Object.keys(tokens.themes.light.contracts.interactive.surface)
    );
  });

  test("exports tones for neutral", () => {
    expect(surfaceTones).toEqual(
      Object.keys(tokens.themes.light.contracts.interactive.surface.neutral)
    );
  });
});
