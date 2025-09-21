import type { SimpleMenuSize, SimpleMenuVariant } from "@/adapters";

import type { UIElementOrientation } from "@/typings";

import type { MenuItems } from "@/components/atoms";

export type SimpleMenuOrientation = UIElementOrientation;

export interface SimpleMenuProps {
  variant?: SimpleMenuVariant;
  size?: SimpleMenuSize;
  // mode?: SimpleMenuMode;
  orientation?: UIElementOrientation;
  divider?: boolean;
  as?: keyof HTMLElementTagNameMap;
  role?: string;
  ariaLabel?: string;
}

export interface SimpleMenuProps<T = string> {
  selectedItemId: number;
  items: MenuItems<T>;
  orientation?: SimpleMenuOrientation;
}
