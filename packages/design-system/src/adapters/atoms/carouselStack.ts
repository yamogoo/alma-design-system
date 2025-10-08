import tokens from "@/tokens";

export type CarousleStackSize =
  keyof typeof tokens.components.atoms.carouselStack.default;
export const carouselStackSizes = Object.keys(
  tokens.components.atoms.carouselStack.default
) as CarousleStackSize[];
