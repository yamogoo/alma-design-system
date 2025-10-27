import { NAMESPACE } from "@/constants";

import type {
  InputSize,
  InputMode,
  InputTone,
  InputVariant,
} from "@/adapters/atoms/input";

import type { InputTypeHTMLAttribute } from "vue";

import type { UIElementStylingModifiers } from "@/typings";

export type InputState = "focused";

export interface InputProps
  extends Partial<
    UIElementStylingModifiers<InputVariant, InputSize, InputMode, InputTone>
  > {
  value: string;
  placeholder?: string;
  isError?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
  isRestButtonEnabled?: boolean;
  ariaPlaceholder?: string;
  autocomplete?: string;
  type?: InputTypeHTMLAttribute;
  errorMessage?: string | null;
}

export const INPUT_PREFIX = `${NAMESPACE}input`;
