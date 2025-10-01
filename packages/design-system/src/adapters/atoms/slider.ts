import tokens from "@/tokens";

export type SliderVariant = keyof typeof tokens.components.atoms.slider;
export const sliderVariants = Object.keys(
  tokens.components.atoms.slider
) as SliderVariant[];

export type SliderSize = keyof typeof tokens.components.atoms.slider.default;
export const sliderSizes = Object.keys(
  tokens.components.atoms.slider.default
) as SliderSize[];

export type SliderMode =
  keyof typeof tokens.themes.light.components.atoms.slider;
export const sliderModes = Object.keys(
  tokens.themes.light.components.atoms.slider
) as SliderMode[];

export type SliderTone =
  keyof typeof tokens.themes.light.components.atoms.slider.accent;
export const sliderTones = Object.keys(
  tokens.themes.light.components.atoms.slider.accent
) as SliderTone[];

export type SliderState =
  keyof typeof tokens.themes.light.components.atoms.slider.accent.primary.track;
export const sliderStates = Object.keys(
  tokens.themes.light.components.atoms.slider.accent.primary.track
) as SliderState[];
