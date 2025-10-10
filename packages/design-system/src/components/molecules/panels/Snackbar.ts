import { NAMESPACE } from "@/constants";

import type {
  SnackbarMode,
  SnackbarSize,
  SnackbarTone,
  SnackbarVariant,
} from "@/adapters/molecules/snackbar";

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

export const SNACKBAR_PREFIX = `${NAMESPACE}snackbar`;
