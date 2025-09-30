import type {
  OptionsMode,
  OptionsSize,
  OptionsVariant,
  OptionsTone,
} from "@/adapters/atoms/options";

import type { UIElementStylingModifiers } from "@/typings";

export type OptionsItems<T> = Array<T>;

export interface OptionsProps<T>
  extends Partial<
    UIElementStylingModifiers<
      OptionsVariant,
      OptionsSize,
      OptionsMode,
      OptionsTone
    >
  > {
  value: T;
  items: OptionsItems<T>;
  isCurrentOptionShown?: boolean;
}
