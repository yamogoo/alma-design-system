import tokens from "@alma/tokens";

export type ResizeBoundingVariant = keyof typeof tokens.atoms.resizeBounding;
export const resizeBoundingVariants = Object.keys(
  tokens.atoms.resizeBounding
) as ResizeBoundingVariant[];

export type ResizeBoundingSize =
  keyof typeof tokens.atoms.resizeBounding.default;
export const resizeBoundingSizes = Object.keys(
  tokens.atoms.resizeBounding.default
) as ResizeBoundingSize[];

export type ResizeBoundingMode =
  keyof typeof tokens.themes.light.atoms.resizeBounding;
export const resizeBoundingModes = Object.keys(
  tokens.themes.light.atoms.resizeBounding
) as ResizeBoundingMode[];

export type ResizeBoundingTone =
  keyof typeof tokens.themes.light.atoms.resizeBounding.accent;
export const resizeBoundingTones = Object.keys(
  tokens.themes.light.atoms.resizeBounding.accent
) as ResizeBoundingTone[];
