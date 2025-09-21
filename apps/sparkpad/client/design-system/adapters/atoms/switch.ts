import tokens from "@/tokens";

export type SwitchMode = keyof typeof tokens.themes.light.atoms.switch;
export const switchModes = Object.keys(
  tokens.themes.light.atoms.switch
) as Array<SwitchMode>;

export type SwitchVariant = keyof typeof tokens.atoms.switch;
export const switchVariants = Object.keys(
  tokens.atoms.switch
) as Array<SwitchVariant>;

export type SwitchSize = keyof typeof tokens.atoms.switch.default;
export const switchSizes = Object.keys(
  tokens.atoms.switch.default
) as Array<SwitchSize>;
