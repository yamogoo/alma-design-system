import type { SurfaceProps } from "@/components/atoms/containers/Surface";

export interface SheetProps extends SurfaceProps {
  isOpen: boolean;
  isDialog?: boolean;
}
