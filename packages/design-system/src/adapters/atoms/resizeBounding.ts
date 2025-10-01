import tokens from "@/tokens";

export type ResizeBoundingVariant =
  keyof typeof tokens.components.atoms.resizeBounding;
export const resizeBoundingVariants = Object.keys(
  tokens.components.atoms.resizeBounding
) as ResizeBoundingVariant[];

export type ResizeBoundingSize =
  keyof typeof tokens.components.atoms.resizeBounding.default;
export const resizeBoundingSizes = Object.keys(
  tokens.components.atoms.resizeBounding.default
) as ResizeBoundingSize[];

export type ResizeBoundingMode =
  keyof typeof tokens.themes.light.components.atoms.resizeBounding;
export const resizeBoundingModes = Object.keys(
  tokens.themes.light.components.atoms.resizeBounding
) as ResizeBoundingMode[];

export type ResizeBoundingTone =
  keyof typeof tokens.themes.light.components.atoms.resizeBounding.accent;
export const resizeBoundingTones = Object.keys(
  tokens.themes.light.components.atoms.resizeBounding.accent
) as ResizeBoundingTone[];
