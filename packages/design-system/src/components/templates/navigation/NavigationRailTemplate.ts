import type {
  NavigationRailMode,
  NavigationRailSize,
  NavigationRailTone,
  NavigationRailVariant,
} from "@/adapters";

import type { UIElementStylingModifiers } from "@/typings";

export type NavigationRailTemplateProps = Partial<
  UIElementStylingModifiers<
    NavigationRailVariant,
    NavigationRailSize,
    NavigationRailMode,
    NavigationRailTone
  >
>;
