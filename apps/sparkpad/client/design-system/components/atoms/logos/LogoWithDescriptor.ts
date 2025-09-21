import type {
  LogoWithDescriptorMode,
  LogoWithDescriptorSize,
  LogoWithDescriptorTone,
  LogoWithDescriptorVariant,
} from "@/adapters";

export interface LogoWithDescriptorProps {
  variant?: LogoWithDescriptorVariant;
  size?: LogoWithDescriptorSize;
  tone?: LogoWithDescriptorTone;
  mode?: LogoWithDescriptorMode;
  name?: string;
}
