import tokens from "@/tokens";

export type SwitchVariant = keyof typeof tokens.components.atoms.switch;
export const switchVariants = Object.keys(
  tokens.components.atoms.switch
) as Array<SwitchVariant>;

export type SwitchSize = keyof typeof tokens.components.atoms.switch.default;
export const switchSizes = Object.keys(
  tokens.components.atoms.switch.default
) as Array<SwitchSize>;

export type SwitchMode =
  keyof typeof tokens.themes.light.components.atoms.switch;
export const switchModes = Object.keys(
  tokens.themes.light.components.atoms.switch
) as Array<SwitchMode>;

export type SwitchTone =
  keyof typeof tokens.themes.light.components.atoms.switch.neutral;
export const switchTones = Object.keys(
  tokens.themes.light.components.atoms.switch.neutral
) as Array<SwitchTone>;
