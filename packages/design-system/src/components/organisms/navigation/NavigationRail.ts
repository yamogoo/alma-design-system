import { NAMESPACE } from "@/constants";

import type { SimpleMenuProps } from "@/components/molecules/menu/SimpleMenu";
import type { NavigationRailTemplateProps } from "@/components/templates/navigation/NavigationRailTemplate";

export interface NavigationRailProps
  extends NavigationRailTemplateProps,
    Pick<SimpleMenuProps, "items" | "selectedItemIndex"> {}

export const NAVIGATION_RAIL_PREFIX = `${NAMESPACE}navigation-rail`;
