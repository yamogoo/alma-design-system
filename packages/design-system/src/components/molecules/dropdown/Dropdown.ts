import { NAMESPACE } from "@/constants";

import type {
  DropdownMode,
  DropdownSize,
  DropdownVariant,
  DropdownTone,
} from "@/adapters/molecules/dropdown";

import type { UIElementStylingModifiers } from "@/typings";

export interface DropdownProps
  extends Partial<
    UIElementStylingModifiers<
      DropdownVariant,
      DropdownSize,
      DropdownMode,
      DropdownTone
    >
  > {
  value: string;
  valuePostfix?: string;
  isResetButtonShown?: boolean;
  closeOnOptionClick?: boolean;
}

export const DROPDOWN_PREFIX = `${NAMESPACE}dropdown`;
