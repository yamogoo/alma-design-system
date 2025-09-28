import type { ActionSheetMode, ActionSheetSize } from "@/adapters";

import type { OverlayId, UIElementUnionProps } from "@/typings";

export interface ActionSheetProps extends Partial<UIElementUnionProps> {
  containerId?: OverlayId;
  size?: ActionSheetSize;
  mode?: ActionSheetMode;
  isActive: boolean;
}
