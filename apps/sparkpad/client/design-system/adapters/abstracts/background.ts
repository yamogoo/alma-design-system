import tokens from "@/tokens";

export type AbstractBackgroundMode =
  keyof typeof tokens.themes.light.abstracts.background;
export const abstracBackgroundModes = Object.keys(
  tokens.themes.light.abstracts.background
) as AbstractBackgroundMode[];

// export type AbstractLabelTone =
//   keyof typeof tokens.themes.light.abstracts.label.neutral;
// export const abstractLabelTones = Object.keys(
//   tokens.themes.light.abstracts.label.neutral
// ) as AbstractLabelTone[];
