import type { DropdownMode, DropdownSize, DropdownVariant } from "@/adapters";

import type { UIElementUnionProps } from "@/typings";

export interface DropdownProps extends Partial<UIElementUnionProps> {
  variant?: DropdownVariant;
  size?: DropdownSize;
  mode?: DropdownMode;
  value: string;
  valuePostfix?: string;
  isResetButtonShown?: boolean;
  closeOnOptionClick?: boolean;
}
