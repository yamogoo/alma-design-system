import tokens from "@/tokens";

export type AbstractLabelMode =
  keyof typeof tokens.themes.light.abstracts.label;
export const abstractLabelModes = Object.keys(
  tokens.themes.light.abstracts.label
) as AbstractLabelMode[];

export type AbstractLabelTone =
  keyof typeof tokens.themes.light.abstracts.label.neutral;
export const abstractLabelTones = Object.keys(
  tokens.themes.light.abstracts.label.neutral
) as AbstractLabelTone[];
