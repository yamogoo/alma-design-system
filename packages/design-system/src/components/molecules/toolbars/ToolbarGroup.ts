import type { ToolbarGroupVariant } from "@/adapters/molecules/toolbarGroup";
import type { GroupProps } from "@/components/molecules/containers/Group";

export interface ToolbarGroupProps
  extends Omit<GroupProps, "variant" | "divider"> {
  variant?: ToolbarGroupVariant;
}
