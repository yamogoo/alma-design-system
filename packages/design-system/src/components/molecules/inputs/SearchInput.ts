import type {
  InputMode,
  InputSize,
  InputTone,
  InputVariant,
} from "@/adapters/atoms/input";

import type { UIElementStylingModifiers } from "@/typings";

import type { InputProps } from "@/components/atoms/inputs/Input";

export interface SearchFieldProps
  extends Partial<
      UIElementStylingModifiers<InputVariant, InputSize, InputMode, InputTone>
    >,
    Partial<Pick<InputProps, "isDisabled" | "placeholder" | "value">> {
  isSearchIconShown?: boolean;
  isResetSearchPhraseWhenClosed?: boolean;
}
