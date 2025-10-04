import type { SurfaceProps } from "@/components/atoms/containers/Surface";

export interface OverlayProps extends SurfaceProps {
  containerId?: string;
  id?: string;
  isOpen?: boolean;
}
