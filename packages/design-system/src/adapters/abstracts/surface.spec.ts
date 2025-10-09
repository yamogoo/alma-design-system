import tokens from "@/tokens";

import {
  getAbstractSurfaceTones,
  getAbstractSurfaceModes,
  getAbstractSurfaceStates,
} from "./surface";

describe("abstracSurface adapter", () => {
  test("exports modes from the light theme", () => {
    expect(getAbstractSurfaceModes()).toEqual(
      Object.keys(tokens.themes.light.contracts.interactive.surface)
    );
  });
  test("exports tones for neutral", () => {
    expect(getAbstractSurfaceTones()).toEqual(
      Object.keys(tokens.themes.light.contracts.interactive.surface.neutral)
    );
  });
  test("exports states for primary", () => {
    expect(getAbstractSurfaceStates()).toEqual(
      Object.keys(
        tokens.themes.light.contracts.interactive.surface.neutral.primary
      )
    );
  });
});
