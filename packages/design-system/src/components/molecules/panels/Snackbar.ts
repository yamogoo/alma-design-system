import type {
  SnackbarMode,
  SnackbarSize,
  SnackbarTone,
  SnackbarVariant,
} from "@/adapters";

import type { UIElementStylingModifiers } from "@/typings";

export interface SnackbarProps
  extends Partial<
    UIElementStylingModifiers<
      SnackbarVariant,
      SnackbarSize,
      SnackbarMode,
      SnackbarTone
    >
  > {
  status?: "info" | "warning";
  isCloseButtonShown?: boolean;
  /** ms */
  lifeTime?: number;
  title?: string;
  description?: string;
}
