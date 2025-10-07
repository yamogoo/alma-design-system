import type {
  NavigationRailMode,
  NavigationRailSize,
  NavigationRailTone,
  NavigationRailVariant,
} from "@/adapters/templates/navigationRail";

import type { UIElementStylingModifiers } from "@/typings";

export type NavigationRailTemplateProps = Partial<
  UIElementStylingModifiers<
    NavigationRailVariant,
    NavigationRailSize,
    NavigationRailMode,
    NavigationRailTone
  >
>;
