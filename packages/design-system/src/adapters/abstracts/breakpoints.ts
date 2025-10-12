import breakpoints from "@/tokens/src/breakpoints.json";

export type AbstractBreakpoint = keyof typeof breakpoints;
export const abstractBreakpoints = Object.keys(
  breakpoints
) as AbstractBreakpoint[];
