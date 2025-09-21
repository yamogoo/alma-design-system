import type { OptionsMode, OptionsSize, OptionsVariant } from "@/adapters";

export type OptionsItems<T> = Array<T>;

export interface OptionsProps<T> {
  variant?: OptionsVariant;
  size?: OptionsSize;
  mode?: OptionsMode;
  value: T;
  items: OptionsItems<T>;
  isCurrentOptionShown?: boolean;
}
