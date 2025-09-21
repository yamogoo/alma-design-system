import type { TransitionType, UIElementColor } from "@/typings";

export type PageColor = Extract<UIElementColor, "primary" | "accent">;

export interface PageProps {
  isFooterShown?: boolean;
  isDragging?: boolean;
  useGlobalTransition?: boolean;
  transitionInType?: TransitionType;
  transitionOutType?: TransitionType;
  color?: PageColor;
}
