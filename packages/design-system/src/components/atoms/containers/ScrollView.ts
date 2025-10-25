import { NAMESPACE } from "@/constants";

import type { UIElementBlockTag, UIElementOrientation } from "@/typings";

export type ScrollViewDirection = UIElementOrientation | "both";

export interface ScrollViewProps {
  as?: UIElementBlockTag;
  direction?: ScrollViewDirection;
  hideScrollbar?: boolean;
}

export const SCROLL_VIEW_PREFIX = `${NAMESPACE}scroll-view`;
