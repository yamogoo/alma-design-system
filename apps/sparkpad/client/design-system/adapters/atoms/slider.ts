import tokens from "@/tokens";

export type SliderVariant = keyof typeof tokens.atoms.slider;
export const sliderVariants = Object.keys(
  tokens.atoms.slider
) as SliderVariant[];

export type SliderSize = keyof typeof tokens.atoms.slider.default;
export const sliderSizes = Object.keys(
  tokens.atoms.slider.default
) as SliderSize[];

export type SliderMode = keyof typeof tokens.themes.light.atoms.slider;
export const sliderModes = Object.keys(
  tokens.themes.light.atoms.slider
) as SliderMode[];

export type SliderTone = keyof typeof tokens.themes.light.atoms.slider.accent;
export const sliderTones = Object.keys(
  tokens.themes.light.atoms.slider.accent
) as SliderTone[];
