import { NAME_SPACE } from "@/constants";

import type {
  ControlWrapperSize,
  ControlWrapperVariant,
} from "@/adapters/atoms/controlWrapper";

import type { UIElementStylingModifiers } from "@/typings";

export type ControlWrapperProps = Partial<
  Pick<
    UIElementStylingModifiers<ControlWrapperVariant, ControlWrapperSize>,
    "variant" | "size"
  >
>;

export const CONTROL_WRAPPER_PREFIX = `${NAME_SPACE}control-wrapper`;
