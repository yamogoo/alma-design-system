import type { ButtonEvent } from "@/typings";

declare global {
  interface GlobalEventHandlersEventMap {
    "control-action": unknown;
  }
}
