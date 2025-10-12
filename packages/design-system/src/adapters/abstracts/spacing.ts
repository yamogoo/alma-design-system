import spacing from "@/tokens/src/tokens/spacing.json";

export type AbstractSpacing = keyof typeof spacing;
export const abstractSpacings = Object.keys(spacing) as AbstractSpacing[];
