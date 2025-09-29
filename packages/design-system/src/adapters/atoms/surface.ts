import tokens from "@/tokens";

export type SurfaceVariant = keyof typeof tokens.atoms.surface;
export const surfaceVariants = Object.keys(
  tokens.atoms.surface
) as SurfaceVariant[];

export type SurfaceSize = keyof typeof tokens.atoms.surface.default;
export const surfaceSizes = Object.keys(
  tokens.atoms.surface.default
) as SurfaceSize[];

export type SurfaceMode = keyof typeof tokens.themes.light.atoms.surface;
export const surfaceModes = Object.keys(
  tokens.themes.light.atoms.surface
) as SurfaceMode[];

export type SurfaceTone = keyof typeof tokens.themes.light.atoms.surface.accent;
export const surfaceTones = Object.keys(
  tokens.themes.light.atoms.surface.accent
) as SurfaceTone[];
