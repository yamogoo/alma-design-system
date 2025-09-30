import type {
  ListItemMode,
  ListItemSize,
  ListItemTone,
  ListItemVariant,
} from "@/adapters/molecules/listItem";

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
  isSelectOnRelease?: boolean;
}
