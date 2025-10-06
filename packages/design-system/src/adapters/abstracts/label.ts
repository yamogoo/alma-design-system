import tokens from "@/tokens";

export type AbstractLabelMode =
  keyof typeof tokens.themes.light.contracts.interactive.label;
export const abstractLabelModes = Object.keys(
  tokens.themes.light.contracts.interactive.label
) as AbstractLabelMode[];

export type AbstractLabelTone =
  keyof typeof tokens.themes.light.contracts.interactive.label.neutral;
export const abstractLabelTones = Object.keys(
  tokens.themes.light.contracts.interactive.label.neutral
) as AbstractLabelTone[];
