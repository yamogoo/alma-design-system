import tokens from "@alma/tokens";

export type LogoWithDescriptorVariant =
  keyof typeof tokens.atoms.logoWithDescriptor;

export const LogoWithDescriptorVariants = Object.keys(
  tokens.atoms.logoWithDescriptor
) as Array<LogoWithDescriptorVariant>;

export type LogoWithDescriptorSize =
  keyof typeof tokens.atoms.logoWithDescriptor.default;

export const LogoWithDescriptorSizes = Object.keys(
  tokens.atoms.logoWithDescriptor.default
) as Array<LogoWithDescriptorSize>;

export const LogoWithDescriptorModes = Object.keys(
  tokens.themes.light.atoms.logoWithDescriptor
) as Array<LogoWithDescriptorMode>;

export type LogoWithDescriptorMode =
  keyof typeof tokens.themes.light.atoms.logoWithDescriptor;

export const LogoWithDescriptorTones = Object.keys(
  tokens.themes.light.atoms.logoWithDescriptor.default
) as Array<LogoWithDescriptorTone>;
export type LogoWithDescriptorTone =
  keyof typeof tokens.themes.light.atoms.logoWithDescriptor.default;
