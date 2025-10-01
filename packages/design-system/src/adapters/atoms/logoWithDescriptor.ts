import tokens from "@/tokens";

export type LogoWithDescriptorVariant =
  keyof typeof tokens.components.atoms.logoWithDescriptor;

export const LogoWithDescriptorVariants = Object.keys(
  tokens.components.atoms.logoWithDescriptor
) as Array<LogoWithDescriptorVariant>;

export type LogoWithDescriptorSize =
  keyof typeof tokens.components.atoms.logoWithDescriptor.default;

export const LogoWithDescriptorSizes = Object.keys(
  tokens.components.atoms.logoWithDescriptor.default
) as Array<LogoWithDescriptorSize>;

export const LogoWithDescriptorModes = Object.keys(
  tokens.themes.light.components.atoms.logoWithDescriptor
) as Array<LogoWithDescriptorMode>;

export type LogoWithDescriptorMode =
  keyof typeof tokens.themes.light.components.atoms.logoWithDescriptor;

export const LogoWithDescriptorTones = Object.keys(
  tokens.themes.light.components.atoms.logoWithDescriptor.neutral
) as Array<LogoWithDescriptorTone>;
export type LogoWithDescriptorTone =
  keyof typeof tokens.themes.light.components.atoms.logoWithDescriptor.neutral;
