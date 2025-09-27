export type UIElementColor =
  | `${"primary" | "secondary"}${"" | "-inversed" | "-transparental"}`
  | `${"transclucent"}${"" | "-inversed"}`
  | `${"tertiary"}${"" | "-inversed"}`
  | "transparental"
  | "accent"
  | "accent-secondary"
  | "accept"
  | "disabled"
  | "warning"
  | "error"
  | "info";

export type UIElementSize =
  | "xxxs"
  | "xxs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl";

export type UISVGElementStrokeLineCap = "round" | "butt" | "square" | "inherit";

export const UIElementCircularDirections = ["cw", "ccw"];
export type UIElementCircularDirection =
  (typeof UIElementCircularDirections)[number];

export const UIElementDirections = ["ltr", "rtl"] as const;
export type UIElementDirection = (typeof UIElementDirections)[number];

export const UIElementAxisDirections = ["forward", "backward"] as const;
export type UIElementAxisDirection = (typeof UIElementAxisDirections)[number];

export const UIElementPositions = ["left", "top", "bottom", "right"] as const;
export type UIElementPosition = (typeof UIElementPositions)[number];

export const UIElementOrientations = ["horizontal", "vertical"] as const;
export type UIElementOrientation = (typeof UIElementOrientations)[number];

export const UIElementAlignments = ["start", "center", "end"] as const;
export type UIElementAlignment = (typeof UIElementAlignments)[number];

export const UIElementStretches = ["fill", "auto"] as const;
export type UIElementStretch = (typeof UIElementStretches)[number];

export type UIElementItemID<T = string> = {
  id: T;
};

export type UIElementVariant = "default";

export type UIElementSID<T = string | null | undefined> = T;

export type UIElementContentKey = string | number | Symbol;

export type UIElementTypographyTitleTag = `h${1 | 2 | 3 | 4 | 5 | 6}`;

export type UIElementTypographyLinkTag = "a";

export type UIElementTypographyListItemTag = "li" | "ol" | "ul";

export type UIElementTypographyParagraphTag = "p" | "span" | "a" | "b" | "i";

export type UIElementHeaderTag = "div" | "header" | "section";

export type UIElementFooterTag = "div" | "footer" | "section";

export const UIElementBlockTags = [
  "div",
  "header",
  "footer",
  "section",
] as const;
export type UIElementBlockTag = (typeof UIElementBlockTags)[number];

export type UIElementTypographyTag =
  | UIElementTypographyTitleTag
  | UIElementTypographyParagraphTag
  | UIElementTypographyLinkTag
  | UIElementTypographyListItemTag;

export interface UIElementUnionProps<V = UIElementVariant> {
  variant?: V;
}

export interface UIElementStylingModifiers<V, S, M = unknown, T = unknown> {
  variant: V;
  size: S;
  mode: M;
  tone: T;
}
