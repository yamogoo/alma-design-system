import { NAMESPACE } from "@/constants";

import type {
  UIElementMaybeListOrBlockTag,
  UIElementSelectedItemIndexes,
  UIElementSelectedItemIndexesProps,
} from "@/typings";
import type { IListItem } from "@/components/atoms/list/ListItem";
import type { GroupProps } from "@/components/molecules/containers/Group";

export type ListSelectedItemIndex = IListItem["id"];
export type ListSelectedItemIndexes = UIElementSelectedItemIndexes;

export type ListItems = Array<IListItem> | Array<string>;

export interface ListProps
  extends Omit<GroupProps, "as">,
    Partial<UIElementSelectedItemIndexesProps> {
  as?: UIElementMaybeListOrBlockTag;
  items?: ListItems;
  isCurrentItemShown?: boolean;
  isSelectable?: boolean;
  isRadioButton?: boolean;
  isClickable?: boolean;
  isMultiple?: boolean;
  isJoined?: boolean;
}

export interface ListInjection {
  selectedItemIndexes:
    | import("vue").Ref<ListSelectedItemIndex | ListSelectedItemIndex[] | null>
    | null;
  setSelectedItemIndexes: (id: ListSelectedItemIndex | null) => void;
  isCurrentItemShown: import("vue").ComputedRef<boolean> | null;
  isSelectable: import("vue").ComputedRef<boolean> | null;
  isRadioButton: import("vue").ComputedRef<boolean> | null;
  isClickable: import("vue").ComputedRef<boolean> | null;
  isJoined: import("vue").ComputedRef<boolean> | null;
}

export const ListInjectionKey: unique symbol = Symbol("ListContext");

export const LIST_PREFIX = `${NAMESPACE}list`;
