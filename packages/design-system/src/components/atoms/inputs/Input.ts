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
  areaPlaceholder?: string;
  autocomplete?: string;
  type?: InputTypeHTMLAttribute;
  errorMessage?: string | null;
}
