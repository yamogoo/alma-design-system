import { NAMESPACE } from "@/constants";

import type { UIElementBlockTag, UIElementListItemTag } from "@/typings";

export interface SpacerProps {
  as?: UIElementBlockTag | UIElementListItemTag;
}

export const SPACER_PREFIX = `${NAMESPACE}spacer`;
