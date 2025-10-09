import tokens from "@/tokens";

const modesCache = Object.keys(
  tokens.themes.light.contracts.interactive.surface
) as Array<keyof typeof tokens.themes.light.contracts.interactive.surface>;

const tonesCache = Object.keys(
  tokens.themes.light.contracts.interactive.surface.neutral
) as Array<
  keyof typeof tokens.themes.light.contracts.interactive.surface.neutral
>;

const statesCache = Object.keys(
  tokens.themes.light.contracts.interactive.surface.neutral.primary
) as Array<
  keyof typeof tokens.themes.light.contracts.interactive.surface.neutral.primary
>;

export type AbstractSurfaceMode =
  keyof typeof tokens.themes.light.contracts.interactive.surface;
export const getAbstractSurfaceModes = () => modesCache.slice();

export type AbstractSurfaceTone =
  keyof typeof tokens.themes.light.contracts.interactive.surface.neutral;
export const getAbstractSurfaceTones = () => tonesCache.slice();

export type AbstractSurfaceState =
  keyof typeof tokens.themes.light.contracts.interactive.surface.neutral.primary;
export const getAbstractSurfaceStates = () => statesCache.slice();
