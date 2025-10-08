import tokens from "@/tokens";

export type LogoWithDescriptorVariant =
  keyof typeof tokens.components.atoms.logoWithDescriptor;
export const logoWithDescriptorVariants = Object.keys(
  tokens.components.atoms.logoWithDescriptor
) as Array<LogoWithDescriptorVariant>;

export type LogoWithDescriptorSize =
  keyof typeof tokens.components.atoms.logoWithDescriptor.default;
export const logoWithDescriptorSizes = Object.keys(
  tokens.components.atoms.logoWithDescriptor.default
) as Array<LogoWithDescriptorSize>;

export type LogoWithDescriptorMode =
  keyof typeof tokens.themes.light.components.atoms.logoWithDescriptor;
export const logoWithDescriptorModes = Object.keys(
  tokens.themes.light.components.atoms.logoWithDescriptor
) as Array<LogoWithDescriptorMode>;

export type LogoWithDescriptorTone =
  keyof typeof tokens.themes.light.components.atoms.logoWithDescriptor.neutral;
export const logoWithDescriptorTones = Object.keys(
  tokens.themes.light.components.atoms.logoWithDescriptor.neutral
) as Array<LogoWithDescriptorTone>;
