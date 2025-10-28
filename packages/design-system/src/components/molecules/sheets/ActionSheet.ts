import { NAMESPACE } from "@/constants";

import type { ActionSheetSize, ActionSheetVariant } from "@/adapters";

import type {
  OverlayId,
  UIElementStylingModifiers,
  UIElementTitleProps,
} from "@/typings";

import type {
  SurfaceFacetVariantsProps,
  SurfaceProps,
} from "@/components/atoms/containers/Surface";

export interface ActionSheetProps
  extends Partial<
      Pick<
        UIElementStylingModifiers<ActionSheetVariant, ActionSheetSize>,
        "variant" | "size"
      >
    >,
    Omit<SurfaceProps, "variant" | "size">,
    Partial<UIElementTitleProps> {
  surface?: Partial<SurfaceFacetVariantsProps>;
  containerId?: OverlayId;
  isOpen: boolean;
}

export const ACTION_SHEET_PREFIX = `${NAMESPACE}action-sheet`;
