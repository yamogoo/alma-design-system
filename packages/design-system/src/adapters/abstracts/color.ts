import tokens from "@/tokens";

const colors = tokens.colors;
export type AbstractColorName = keyof typeof tokens.colors;
export const abstractColorNames = Object.keys(
  tokens.colors
) as AbstractColorName[];

export { colors as abstractColors };
