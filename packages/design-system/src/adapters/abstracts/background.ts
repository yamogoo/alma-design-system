import tokens from "@/tokens";

export type AbstractSurfaceMode =
  keyof typeof tokens.themes.light.abstracts.surface;
export const abstracSurfaceModes = Object.keys(
  tokens.themes.light.abstracts.surface
) as AbstractSurfaceMode[];

export type AbstractSurfaceTone =
  keyof typeof tokens.themes.light.abstracts.surface.neutral;
export const abstractSurfaceTones = Object.keys(
  tokens.themes.light.abstracts.surface.neutral
) as AbstractSurfaceTone[];
