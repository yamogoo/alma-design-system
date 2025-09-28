import tokens from "@alma/tokens";

export type ControlWrapperVariant = keyof typeof tokens.atoms.controlWrapper;

export const controlWrapperVariants = Object.keys(
  tokens.atoms.controlWrapper
) as ControlWrapperVariant[];

export type ControlWrapperSize =
  keyof typeof tokens.atoms.controlWrapper.default;

export const controlWrapperSizes = Object.keys(
  tokens.atoms.controlWrapper.default
) as ControlWrapperSize[];
