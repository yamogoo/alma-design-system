import type { ListMode, ListSize, ListVariant, ListTone } from "@/adapters";

import type {
  UIElementMaybeListOrBlockTag,
  UIElementStylingModifiers,
} from "@/typings";
import type { IListItem } from "./ListItem";

export type ListItems = Array<IListItem> | Array<string>;

export interface ListProps
  extends Partial<
    UIElementStylingModifiers<ListVariant, ListSize, ListMode, ListTone>
  > {
  as?: UIElementMaybeListOrBlockTag;
  selectedItemId?: IListItem["id"] | IListItem["id"][] | null;
  items?: ListItems;
  isCurrentItemShown?: boolean;
  isSelectable?: boolean;
  isMultiple?: boolean;
}

export interface ListInjection {
  selectedItemId:
    | import("vue").Ref<IListItem["id"] | IListItem["id"][] | null>
    | null;
  setSelectedItemId: (id: IListItem["id"] | null) => void;
  isCurrentItemShown: import("vue").ComputedRef<boolean> | null;
  isSelectable: import("vue").ComputedRef<boolean> | null;
}

export const ListInjectionKey: unique symbol = Symbol("ListContext");
