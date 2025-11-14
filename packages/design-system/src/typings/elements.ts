export type UIElementBooleanish = "true" | "false";

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

export const UIElementShortPositions = {
  RIGHT: "r",
  LEFT: "l",
  TOP: "t",
  BOTTOM: "b",
} as const;
export type UIElementShortPosition =
  (typeof UIElementShortPositions)[keyof typeof UIElementShortPositions];

export const UIElementShortPositionAliases = {
  HORIZONTAL: "h",
  VERTICAL: "v",
} as const;

export type UIElementShortPositionAlias =
  (typeof UIElementShortPositionAliases)[keyof typeof UIElementShortPositionAliases];

export type UIElementEdgeSpacing =
  | UIElementShortPosition
  | UIElementShortPositionAlias;

export const UIElementOrientations = ["horizontal", "vertical"] as const;
export type UIElementOrientation = (typeof UIElementOrientations)[number];

export const UIElementAlignments = ["start", "center", "end"] as const;
export type UIElementAlignment = (typeof UIElementAlignments)[number];

export const UIElementStretches = ["fill", "auto", "row"] as const;
export type UIElementStretch = (typeof UIElementStretches)[number];

export type UIElementItemID<T = string> = {
  id: T;
};

export type UIElementVariant = "default";

export type UIElementSID<T = string | null | undefined> = T;

export type UIElementContentKey = string | number | symbol;

export type UIElementTypographyTitleTag = `h${1 | 2 | 3 | 4 | 5 | 6}`;

export type UIElementTypographyLinkTag = "a";

export const UIElementListsTags = ["ol", "ul", "dl"] as const;
export type UIElementListsTag = (typeof UIElementListsTags)[number];

export const UIElementListItemTags = ["li", "dt", "dd"] as const;
export type UIElementListItemTag = (typeof UIElementListItemTags)[number];

export const UIElementMaybeListOrBlockTags = [
  ...UIElementListsTags,
  "div",
] as const;
export type UIElementMaybeListsOrBlockTag =
  (typeof UIElementMaybeListOrBlockTags)[number];

export type UIElementMaybeListOrBlockTag = "div" | "ul";

export const UIElementMaybeListItemOrBlockTags = [
  ...UIElementListItemTags,
  "div",
] as const;
export type UIElementMaybeListItemOrBlockTag =
  (typeof UIElementMaybeListItemOrBlockTags)[number];

export type UIElementTypographyParagraphTag = "p" | "span" | "a" | "b" | "i";

export type UIElementHeaderTag = "div" | "header" | "section";

export type UIElementFooterTag = "div" | "footer" | "section";

export const UIElementBlockTags = [
  "div",
  "header",
  "footer",
  "section",
  "main",
] as const;
export type UIElementBlockTag = (typeof UIElementBlockTags)[number];

export type UIElementTypographyTag =
  | UIElementTypographyTitleTag
  | UIElementTypographyParagraphTag
  | UIElementTypographyLinkTag
  | UIElementListsTag
  | UIElementListItemTag;

export interface UIElementUnionProps<V = UIElementVariant> {
  variant?: V;
}

export interface UIElementStylingModifiers<
  V,
  SZ,
  M = unknown,
  T = unknown,
  ST = unknown,
> {
  variant: V;
  size: SZ;
  mode: M;
  tone: T;
  state: ST;
}

/* * * Props * * */

export interface UIElementAlignmentProps<
  H = UIElementAlignment,
  V = UIElementAlignment,
> {
  alignHorizontal?: H;
  alignVertical?: V;
}

export interface UIElementDirectionProps<D = UIElementAxisDirection> {
  direction?: D;
}

export interface UIElementOrientationProps<O = UIElementOrientation> {
  orientation?: O;
}

export interface UIElementStretchProps<S = UIElementStretch> {
  stretch?: S;
}

export interface UIElementWrapProps {
  wrap?: boolean;
}

export interface UIElementBorderedProps {
  bordered?: boolean;
}

export interface UIElementDividerProps {
  divider?: boolean;
}

export interface UIElementPaddingProps {
  padding?: Array<
    UIElementEdgeSpacing | UIElementShortPosition | UIElementShortPositionAlias
  >;
}

export interface UIElementMarginProps {
  margin?: Array<
    UIElementEdgeSpacing | UIElementShortPosition | UIElementShortPositionAlias
  >;
}

export interface UIElementRoundedProps {
  rounded?: boolean;
}

export interface UIElementElevatedProps {
  elevated?: boolean;
}

export interface UIElementBorderProps {
  border?: string;
}

export interface UIElementLabelProps {
  label: string;
}

export interface UIElementTitleProps {
  title: string;
}

export interface UIElementDescriptionProps {
  description: string;
}

export interface UIElementValueProps {
  value: string;
}

/* * * Selected ID * * */

export interface UIElementItemIndexProps {
  id: string;
}

export type UIElementSelectedItemIndex = UIElementItemIndexProps["id"];

export type UIElementSelectedItemIndexes =
  | (UIElementSelectedItemIndex | UIElementSelectedItemIndex[])
  | null;

export interface UIElementSelectedItemIndexesProps {
  selectedItemIndexes: UIElementSelectedItemIndexes;
}
