import { NAMESPACE } from "@/constants";

import type {
  TabbarMode,
  TabbarSize,
  TabbarTone,
  TabbarVariant,
} from "@/adapters/molecules/tabbar";

import type {
  UIElementMaybeListOrBlockTag,
  UIElementStylingModifiers,
} from "@/typings";

import type { TabbarItem } from "./TabbarItem";

export type TabbarSelectedItemIndex = TabbarItem["id"];
export type TabbarSelectedItemIndexes = [
  (TabbarSelectedItemIndex | TabbarSelectedItemIndex[]) | null,
];

export type TabbarItems = Array<TabbarItem>;

export interface TabbarProps
  extends Partial<
    UIElementStylingModifiers<TabbarVariant, TabbarSize, TabbarMode, TabbarTone>
  > {
  as?: UIElementMaybeListOrBlockTag;
  selectedItemIndexes?:
    | TabbarSelectedItemIndex
    | TabbarSelectedItemIndex[]
    | null;
  items: TabbarItems;
}

export const TABBAR_PREFIX = `${NAMESPACE}tabbar`;
