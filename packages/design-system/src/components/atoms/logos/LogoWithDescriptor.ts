import { NAMESPACE } from "@/constants";

import type {
  LogoWithDescriptorMode,
  LogoWithDescriptorSize,
  LogoWithDescriptorTone,
  LogoWithDescriptorVariant,
} from "@/adapters/atoms/logoWithDescriptor";

import type { UIElementStylingModifiers } from "@/typings";

export interface LogoWithDescriptorProps
  extends Partial<
    UIElementStylingModifiers<
      LogoWithDescriptorVariant,
      LogoWithDescriptorSize,
      LogoWithDescriptorMode,
      LogoWithDescriptorTone
    >
  > {
  name?: string;
}

export const LOGO_WITH_DESCRIPTOR_PREFIX = `${NAMESPACE}logo-with-descriptor`;
