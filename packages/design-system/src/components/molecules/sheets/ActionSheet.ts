import { NAMESPACE } from "@/constants";

import type { OverlayId } from "@/typings";

import type { SurfaceProps } from "@/components/atoms/containers/Surface";

export interface ActionSheetProps extends SurfaceProps {
  containerId?: OverlayId;
  isOpen: boolean;
}

export const ACTION_SHEET_PREFIX = `${NAMESPACE}action-sheet`;
