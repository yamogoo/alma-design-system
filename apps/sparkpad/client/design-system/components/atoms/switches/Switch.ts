import type { SwitchVariant, SwitchMode, SwitchSize } from "@/adapters";

export interface SwitchProps {
  variant?: SwitchVariant;
  mode?: SwitchMode;
  size?: SwitchSize;
  label?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  useNative?: boolean;
}
