import type { OverlayId } from "@/typings";

import type { SurfaceProps } from "@/components/atoms/containers/Surface";

export interface ActionSheetProps extends SurfaceProps {
  containerId?: OverlayId;
  isActive: boolean;
}
