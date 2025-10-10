import { NAMESPACE } from "@/constants";

import type { SurfaceProps } from "@/components/atoms/containers/Surface";

export interface SheetProps extends SurfaceProps {
  isOpen: boolean;
  isDialog?: boolean;
}

export const SHEET_PREFIX = `${NAMESPACE}sheet`;
