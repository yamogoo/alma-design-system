import tokens from "@/tokens";

import {
  abstractSurfaceModes,
  abstractSurfaceTones,
  abstractSurfaceStates,
} from "./background";

describe("abstracSurface adapter", () => {
  test("exports modes from the light theme", () => {
    expect(abstractSurfaceModes).toEqual(
      Object.keys(tokens.themes.light.contracts.interactive.surface)
    );
  });
  test("exports tones for neutral", () => {
    expect(abstractSurfaceTones).toEqual(
      Object.keys(tokens.themes.light.contracts.interactive.surface.neutral)
    );
  });
  test("exports states for primary", () => {
    expect(abstractSurfaceStates).toEqual(
      Object.keys(
        tokens.themes.light.contracts.interactive.surface.neutral.primary
      )
    );
  });
});
