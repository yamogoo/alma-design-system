import { NAMESPACE } from "@/constants";

import type {
  UIElementItemIndexProps,
  UIElementLabelProps,
  UIElementMaybeListItemOrBlockTag,
} from "@/typings";
import type { IconComponentProps } from "@/components/atoms/icons/Icon";

export type TabbarItemTag = UIElementMaybeListItemOrBlockTag;

export interface TabbarItem
  extends UIElementItemIndexProps,
    UIElementLabelProps,
    Partial<IconComponentProps> {
  value?: unknown;
}

export interface TabbarItemProps extends TabbarItem {
  as?: TabbarItemTag;
  isActive?: boolean;
}

export const TAB_ITEM_PREFIX = `${NAMESPACE}tabbar-item`;
