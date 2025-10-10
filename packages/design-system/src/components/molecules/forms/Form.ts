import { NAME_SPACE } from "@/constants";

import type {
  FormMode,
  FormSize,
  FormTone,
  FormVariant,
} from "@/adapters/molecules/form";

import type { UIElementStylingModifiers } from "@/typings";

export interface FormProps
  extends Partial<
    UIElementStylingModifiers<FormVariant, FormSize, FormMode, FormTone>
  > {
  title?: string;
}

export const FORM_PREFIX = `${NAME_SPACE}form`;
