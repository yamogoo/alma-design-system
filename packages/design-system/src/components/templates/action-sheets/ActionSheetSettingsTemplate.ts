import type { AsyncComp } from "@/typings/router";
import type { IMenuitem } from "@/components/molecules/menu/MenuItem";

import type { ActionSheetProps } from "@/components/molecules/sheets/ActionSheet";
import type { ListSelectedItemIndex } from "@/components/molecules/list/List";

export type ActionSheetSettingsTemplateMenuItems = Record<
  "top" | "bottom",
  IMenuitem<AsyncComp>[]
>;

export interface ActionSheetSettingsTemplateProps
  extends Pick<ActionSheetProps, "isOpen"> {
  menuItems: Partial<ActionSheetSettingsTemplateMenuItems>;
  selectedItemIndexes: ListSelectedItemIndex | null;
}
