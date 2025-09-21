import type {
  TransitionType,
  UIElementColor,
  UIElementOrientation,
} from "@/typings";

export type PageTone = Extract<UIElementColor, "primary" | "accent">;
export type PageOrientations = UIElementOrientation;

export interface PageProps {
  isFooterShown?: boolean;
  isDragging?: boolean;
  useGlobalTransition?: boolean;
  transitionInType?: TransitionType;
  transitionOutType?: TransitionType;
  tone?: PageTone;
  orientation?: PageOrientations;
}
