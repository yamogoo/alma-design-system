import tokens from "@/tokens";

export type ControlWrapperVariant =
  keyof typeof tokens.components.atoms.controlWrapper;

export const controlWrapperVariants = Object.keys(
  tokens.components.atoms.controlWrapper
) as ControlWrapperVariant[];

export type ControlWrapperSize =
  keyof typeof tokens.components.atoms.controlWrapper.default;

export const controlWrapperSizes = Object.keys(
  tokens.components.atoms.controlWrapper.default
) as ControlWrapperSize[];
