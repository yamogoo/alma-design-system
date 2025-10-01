import type { UIElementContentKey } from "@/typings";
import type { SurfaceProps } from "@/components/atoms/containers/Surface";

export interface FormWrapperProps extends Partial<SurfaceProps> {
  bordered?: boolean;
  duration?: number;
  contentKey?: UIElementContentKey;
}
