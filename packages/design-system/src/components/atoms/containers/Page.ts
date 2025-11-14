import { NAMESPACE } from "@/constants";

import type { TransitionType, UIElementOrientation } from "@/typings";

export type PageOrientations = UIElementOrientation;

export interface PageProps {
  isFooterShown?: boolean;
  isDragging?: boolean;
  useGlobalTransition?: boolean;
  transitionInType?: TransitionType;
  transitionOutType?: TransitionType;
  orientation?: PageOrientations;
}

export const PAGE_PREFIX = `${NAMESPACE}page`;
