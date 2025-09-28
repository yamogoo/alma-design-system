import colors from "@/tokens";

export type AbstractColorName = keyof typeof colors;
export const abstractColorNames = Object.keys(colors) as AbstractColorName[];

export { colors as abstractColors };
