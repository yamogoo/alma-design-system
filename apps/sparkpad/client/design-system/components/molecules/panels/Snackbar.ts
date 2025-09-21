import type {
  SnackbarMode,
  SnackbarSize,
  SnackbarTone,
  SnackbarVariant,
} from "@/adapters";

export interface SnackbarProps {
  variant?: SnackbarVariant;
  size?: SnackbarSize;
  tone?: SnackbarTone;
  mode?: SnackbarMode;
  status?: "info" | "warning";
  isCloseButtonShown?: boolean;
  /** ms */
  lifeTime?: number;
  title?: string;
  description?: string;
}
