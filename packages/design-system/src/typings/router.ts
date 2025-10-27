import type { defineAsyncComponent } from "vue";

import type { TransitionType } from "@/typings";

export interface RouteMeta {
  rid: number;
  transitionType?: "vertical" | "horizontal";
  transitionIn?: TransitionType;
  transitionOut?: TransitionType;
}

export type AsyncComp = ReturnType<typeof defineAsyncComponent>;
