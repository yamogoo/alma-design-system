import { defineAsyncComponent } from "vue";

import { type ActionSheetSettingsTemplateMenuItems } from "@alma/design-system";

export type AsyncComp = ReturnType<typeof defineAsyncComponent>;

export const menuItems: ActionSheetSettingsTemplateMenuItems = {
  top: [
    {
      id: "appearance",
      label: "Appearance",
      iconName: "colorPalette",
      iconStyle: "outline",
      value: defineAsyncComponent(
        () => import("@/pages/editor/settings/Appearance.vue")
      ) as AsyncComp,
    },
    {
      id: "workspace",
      label: "Workspace",
      iconName: "console",
      iconStyle: "outline",
      value: defineAsyncComponent(
        () => import("@/pages/editor/settings/Workspace.vue")
      ) as AsyncComp,
    },
    {
      id: "system",
      label: "System",
      iconName: "cog",
      iconStyle: "outline",
      value: defineAsyncComponent(
        () => import("@/pages/editor/settings/System.vue")
      ) as AsyncComp,
    },
  ],
  bottom: [
    {
      id: "account",
      label: "Account",
      iconName: "userThumbnail",
      iconStyle: "outline",
      value: defineAsyncComponent(
        () => import("@/pages/editor/settings/Account.vue")
      ) as AsyncComp,
    },
  ],
};

export interface SettingsProps {
  isOpen: boolean;
}
