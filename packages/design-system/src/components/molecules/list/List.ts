import type { UIElementMaybeListOrBlockTag } from "@/typings";
import type { IListItem } from "@/components/atoms/list/ListItem";
import type { GroupProps } from "@/components/atoms/containers/Group";

export type ListSelectedItemIndex = IListItem["id"];
export type ListSelectedItemIndexes = [
  (ListSelectedItemIndex | ListSelectedItemIndex[]) | null,
];

export type ListItems = Array<IListItem> | Array<string>;

export interface ListProps extends Omit<GroupProps, "as"> {
  as?: UIElementMaybeListOrBlockTag;
  selectedItemIndexes?: IListItem["id"] | IListItem["id"][] | null;
  items?: ListItems;
  isCurrentItemShown?: boolean;
  isSelectable?: boolean;
  isMultiple?: boolean;
  isJoined?: boolean;
}

export interface ListInjection {
  selectedItemIndexes:
    | import("vue").Ref<IListItem["id"] | IListItem["id"][] | null>
    | null;
  setSelectedItemIndexes: (id: IListItem["id"] | null) => void;
  isCurrentItemShown: import("vue").ComputedRef<boolean> | null;
  isSelectable: import("vue").ComputedRef<boolean> | null;
  isJoined: import("vue").ComputedRef<boolean> | null;
}

export const ListInjectionKey: unique symbol = Symbol("ListContext");
