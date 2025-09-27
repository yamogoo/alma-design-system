import type {
  NavigationRailMode,
  NavigationRailSize,
  NavigationRailTone,
  NavigationRailVariant,
} from "@/adapters";

import type { UIElementStylingModifiers } from "@/typings";

export interface NavigationRailTemplateProps
  extends Partial<
    UIElementStylingModifiers<
      NavigationRailVariant,
      NavigationRailSize,
      NavigationRailMode,
      NavigationRailTone
    >
  > {}
