import tokens from "@/tokens";

export type SurfaceVariant = keyof typeof tokens.components.atoms.surface;
export const surfaceVariants = Object.keys(
  tokens.components.atoms.surface
) as SurfaceVariant[];

export type SurfaceSize = keyof typeof tokens.components.atoms.surface.default;
export const surfaceSizes = Object.keys(
  tokens.components.atoms.surface.default
) as SurfaceSize[];

export type SurfaceMode =
  keyof typeof tokens.themes.light.components.atoms.surface;
export const surfaceModes = Object.keys(
  tokens.themes.light.components.atoms.surface
) as SurfaceMode[];

export type SurfaceTone =
  keyof typeof tokens.themes.light.components.atoms.surface.accent;
export const surfaceTones = Object.keys(
  tokens.themes.light.components.atoms.surface.accent
) as SurfaceTone[];
