import tokens from "@/tokens";

export type CarousleStackSize = keyof typeof tokens.atoms.carouselStack.default;
export const carousleStackSizes = Object.keys(
  tokens.atoms.carouselStack.default
) as CarousleStackSize[];
