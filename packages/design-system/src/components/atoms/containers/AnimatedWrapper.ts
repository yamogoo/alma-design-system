import { NAME_SPACE } from "@/constants";

import type { UIElementContentKey } from "@/typings";

export interface AnimatedWrapperProps {
  contentKey: UIElementContentKey;
  duration?: number;
}

export const PREFIX = `${NAME_SPACE}animated-wrapper`;
