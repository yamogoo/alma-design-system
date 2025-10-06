import tokens from "@/tokens";

export type AbstractSurfaceMode =
  keyof typeof tokens.themes.light.contracts.interactive.surface;
export const abstracSurfaceModes = Object.keys(
  tokens.themes.light.contracts.interactive.surface
) as AbstractSurfaceMode[];

export type AbstractSurfaceTone =
  keyof typeof tokens.themes.light.contracts.interactive.surface.neutral;
export const abstractSurfaceTones = Object.keys(
  tokens.themes.light.contracts.interactive.surface.neutral
) as AbstractSurfaceTone[];

export type AbstractSurfaceState =
  keyof typeof tokens.themes.light.contracts.interactive.surface.neutral.primary;
export const abstractSurfaceStates = Object.keys(
  tokens.themes.light.contracts.interactive.surface.neutral.primary
) as AbstractSurfaceState[];
