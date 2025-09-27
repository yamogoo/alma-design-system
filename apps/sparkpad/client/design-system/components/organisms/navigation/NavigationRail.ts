import type { SimpleMenuProps } from "@/components/atoms";
import type { NavigationRailTemplateProps } from "@/components/templates";

export interface NavigationRailProps
  extends NavigationRailTemplateProps,
    Pick<SimpleMenuProps, "items" | "selectedItemId"> {}
