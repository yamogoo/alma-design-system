import { NAMESPACE } from "@/constants";

import type {
  SidebarMode,
  SidebarSize,
  SidebarTone,
  SidebarVariant,
} from "@/adapters/molecules/sidebar";

import type { UIElementStylingModifiers } from "@/typings";

export type SidebarProps = Partial<
  UIElementStylingModifiers<
    SidebarVariant,
    SidebarSize,
    SidebarMode,
    SidebarTone
  >
>;

export const SIDEBAR_PREFIX = `${NAMESPACE}sidebar`;
