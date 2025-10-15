export const OVERLAY_IDS = {
  MAIN: "#app",
  NOTIFICATIONS: "#notifications-overlay",
} as const;

export const UIFACETS = {
  VARIANT: "variant",
  SIZE: "size",
  MODE: "mode",
  TONE: "tone",
  STATE: "state",
} as const;
export type UIFacet = (typeof UIFACETS)[keyof typeof UIFACETS];

export const UISTATES = {
  IDLE: "idle",
  NORMAL: "normal",
  HOVERED: "hovered",
  PRESSED: "pressed",
  DISABLED: "disabled",
  ACTIVE: "active",
  SELECTED: "selected",
  EXPANDED: "expanded",
  CURRENT: "current",
  NEXT: "next",
  PREVIOUS: "previous",
  FOCUSED: "focused",
  FOCUS_VISIBLE: "focus-visible",
  ERROR: "error",
} as const;
export type UIState = (typeof UISTATES)[keyof typeof UISTATES];

export const UIMODIFIERS = {
  // with value:
  DIRECTION: "direction",
  ORIENTATION: "orientation",
  ALIGN: "align",
  STRETCH: "stretch",
  WRAP: "wrap",
  BORDER: "border",
  DIVIDER: "divider",
  // without value (flags):
  BORDERED: "bordered",
  GRABBING: "grabbing",
  CLICKABLE: "clickable",
  STATIC: "static",
  ELEVATED: "elevated",
  ROUNDED: "rounded",
  JOINED: "joined",
  // follow the cursor:
  FLOATING: "floating",
  // dimensions:
  PADDING: "padding",
  MARGIN: "margin",
  GAP: "gap",
} as const;
export type UIModifier = (typeof UIMODIFIERS)[keyof typeof UIMODIFIERS];

export const FACETS = Object.values(UIFACETS);
export const STATES = Object.values(UISTATES);
export const MODIFIERS = Object.values(UIMODIFIERS);
