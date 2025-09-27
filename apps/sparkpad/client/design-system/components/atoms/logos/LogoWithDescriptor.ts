import type {
  LogoWithDescriptorMode,
  LogoWithDescriptorSize,
  LogoWithDescriptorTone,
  LogoWithDescriptorVariant,
} from "@/adapters";

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
