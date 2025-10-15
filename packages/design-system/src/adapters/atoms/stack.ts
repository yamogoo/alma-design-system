import tokens from "@/tokens";

export type StackVariant = keyof typeof tokens.components.atoms.stack;
export const stackVariants = Object.keys(
  tokens.components.atoms.stack
) as StackVariant[];

export type StackSize = keyof typeof tokens.components.atoms.stack.default;
export const stackSizes = Object.keys(
  tokens.components.atoms.stack.default
) as StackSize[];
