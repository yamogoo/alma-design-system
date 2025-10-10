import { NAMESPACE } from "@/constants";

import type {
  ListItemMode,
  ListItemSize,
  ListItemTone,
  ListItemVariant,
} from "@/adapters/atoms/listItem";

import type {
  UIElementMaybeListItemOrBlockTag,
  UIElementStylingModifiers,
} from "@/typings";

import type { IconComponentProps } from "@/components/atoms/icons/Icon";

export interface IListItem {
  id: string | number | symbol;
  title: string;
  description?: string;
  isJoined?: boolean;
  divider?: boolean;
  isDisabled?: boolean;
}

export interface ListItemProps
  extends IListItem,
    Partial<IconComponentProps>,
    Partial<
      UIElementStylingModifiers<
        ListItemVariant,
        ListItemSize,
        ListItemMode,
        ListItemTone
      >
    > {
  as?: UIElementMaybeListItemOrBlockTag;
  isActive?: boolean;
  isFocused?: boolean;
  isSelectOnRelease?: boolean;
}

export const LIST_ITEM_PREFIX = `${NAMESPACE}list-item`;
