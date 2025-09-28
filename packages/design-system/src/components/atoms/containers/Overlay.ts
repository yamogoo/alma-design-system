import type { UIElementColor } from "@/typings";

export type OverlayMode = Extract<
  UIElementColor,
  "primary" | "primary-inversed"
>;

export interface OverlayProps {
  id?: string;
  mode?: OverlayMode;
}
