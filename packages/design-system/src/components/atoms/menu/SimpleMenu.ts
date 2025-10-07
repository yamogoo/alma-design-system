import type {
  SimpleMenuSize,
  SimpleMenuVariant,
} from "@/adapters/atoms/simpleMenu";

import type {
  UIElementOrientation,
  UIElementStylingModifiers,
} from "@/typings";

import type { MenuItems } from "@/components/atoms/menu/menu";

export type SimpleMenuOrientation = UIElementOrientation;

export interface SimpleMenuProps
  extends Partial<
    Pick<
      UIElementStylingModifiers<SimpleMenuVariant, SimpleMenuSize>,
      "variant" | "size"
    >
  > {
  as?: keyof HTMLElementTagNameMap;
  orientation?: UIElementOrientation;
  divider?: boolean;
  role?: string;
  ariaLabel?: string;
}

export interface SimpleMenuProps<T = string> {
  selectedItemId: number;
  items: MenuItems<T>;
  orientation?: SimpleMenuOrientation;
}
