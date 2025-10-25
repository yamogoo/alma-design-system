import { NAMESPACE } from "@/constants";

import type { OverlayId, UIElementTitleProps } from "@/typings";

import type { SurfaceProps } from "@/components/atoms/containers/Surface";

export interface ActionSheetProps
  extends SurfaceProps,
    Partial<UIElementTitleProps> {
  containerId?: OverlayId;
  isOpen: boolean;
}

export const ACTION_SHEET_PREFIX = `${NAMESPACE}action-sheet`;
