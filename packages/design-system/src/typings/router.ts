import type { TransitionType } from "@/typings";

export interface RouteMeta {
  rid: number;
  transitionType?: "vertical" | "horizontal";
  transitionIn?: TransitionType;
  transitionOut?: TransitionType;
}
