import { NAMESPACE } from "@/constants";

import type {
  SimpleMenuSize,
  SimpleMenuVariant,
} from "@/adapters/atoms/simpleMenu";

import type {
  UIElementOrientation,
  UIElementStylingModifiers,
} from "@/typings";

import type { ISimpleMenuItem } from "@/components/atoms/menu/menu";

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
  selectedItemIndex: number;
  items: ISimpleMenuItem<T>;
  orientation?: SimpleMenuOrientation;
}

export const SIMPLE_MENU_PREFIX = `${NAMESPACE}simple-menu`;
