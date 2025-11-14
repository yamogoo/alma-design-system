import type { AsyncComp } from "@/typings/router";
import type { IMenuItem } from "@/components/molecules/menu/MenuItem";

import type { ActionSheetProps } from "@/components/molecules/sheets/ActionSheet";
import type { ListSelectedItemIndex } from "@/components/molecules/list/List";

export type ActionSheetSettingsMenuItems = Record<
  "top" | "bottom",
  IMenuItem<AsyncComp | undefined>[]
>;

export interface ActionSheetSettingsProps
  extends Pick<ActionSheetProps, "isOpen" | "containerId"> {
  menuItems: Partial<ActionSheetSettingsMenuItems>;
  selectedItemIndexes: ListSelectedItemIndex | null;
}
