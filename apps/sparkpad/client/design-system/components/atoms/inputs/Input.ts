import type { InputSize, InputMode, InputTone } from "@/adapters";

import type { InputTypeHTMLAttribute } from "vue";

import type { UIElementUnionProps } from "@/typings";

export type InputState = "focused";

export interface InputProps extends Partial<UIElementUnionProps> {
  value: string;
  placeholder?: string;
  mode?: InputMode;
  tone?: InputTone;
  size?: InputSize;
  isError?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
  isRestButtonEnabled?: boolean;
  areaPlaceholder?: string;
  autocomplete?: string;
  type?: InputTypeHTMLAttribute;
  errorMessage?: string | null;
}
