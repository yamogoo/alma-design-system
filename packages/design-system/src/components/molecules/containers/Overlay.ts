import { NAMESPACE } from "@/constants";

import type { SurfaceProps } from "@/components/atoms/containers/Surface";

export interface OverlayProps extends SurfaceProps {
  containerId?: string;
  id?: string;
  isOpen?: boolean;
}

export const OVERLAY_PREFIX = `${NAMESPACE}overlay`;
