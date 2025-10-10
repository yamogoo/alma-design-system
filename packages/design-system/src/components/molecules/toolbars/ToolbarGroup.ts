import { NAMESPACE } from "@/constants";

import type { ToolbarGroupVariant } from "@/adapters/molecules/toolbarGroup";
import type { GroupProps } from "@/components/molecules/containers/Group";

export interface ToolbarGroupProps
  extends Omit<GroupProps, "variant" | "divider"> {
  variant?: ToolbarGroupVariant;
}

export const TOOLBAR_GROUP_PREFIX = `${NAMESPACE}toolbar-group`;
