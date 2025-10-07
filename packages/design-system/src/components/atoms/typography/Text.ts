import type {
  TextVariant,
  TextMode,
  TextTone,
  TextState,
} from "@/adapters/atoms/text";

import type { UIElementTypographyTag } from "@/typings";

export type TextStyle = "normal" | "italic" | "oblique";

export type TextTransform =
  | "none"
  | "capitalize"
  | "uppercase"
  | "lowercase"
  | "full-width";

export type TextDecoration = "none" | "underline" | "line-through";

export interface TextProps {
  as?: UIElementTypographyTag;
  value?: string;
  variant?: TextVariant;
  mode?: TextMode;
  tone?: TextTone;
  state?: TextState;
  display?: "inline-block" | "block";
  color?: string;
  weight?: string;
  align?: "left" | "center" | "right" | "justify";
  size?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: TextTransform;
  textDecoration?: TextDecoration;
  fontFamily?: string;
  fontStyle?: TextStyle;
  fontSize?: string;
  fontWeight?: string;
  fontStretch?: string;
  fontVariant?: string;
  fontFeatureSettings?: string;
  fontSynthesis?: string;
  textIndent?: string;
  textOverflow?: "clip" | "ellipsis";
}
