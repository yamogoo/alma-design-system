import { NAMESPACE } from "@/constants";

import type { UIElementContentKey } from "@/typings";

export interface AnimatedWrapperProps {
  contentKey: UIElementContentKey;
  duration?: number;
}

export const ANIMATED_WRAPPER_PREFIX = `${NAMESPACE}animated-wrapper`;
