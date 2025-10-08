import type { SimpleMenuProps } from "@/components/atoms/menu/SimpleMenu";
import type { NavigationRailTemplateProps } from "@/components/templates/navigation/NavigationRailTemplate";

export interface NavigationRailProps
  extends NavigationRailTemplateProps,
    Pick<SimpleMenuProps, "items" | "selectedItemIndex"> {}
