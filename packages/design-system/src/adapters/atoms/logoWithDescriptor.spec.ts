import tokens from "@/tokens";

import {
  logoWithDescriptorVariants,
  logoWithDescriptorSizes,
  logoWithDescriptorModes,
  logoWithDescriptorTones,
} from "./logoWithDescriptor";

describe("logoWithDescriptor adapter", () => {
  test("exports all variants of the logoWithDescriptor", () => {
    expect(logoWithDescriptorVariants).toEqual(
      Object.keys(tokens.components.atoms.logoWithDescriptor)
    );
  });

  test("exports sizes for variant default", () => {
    expect(logoWithDescriptorSizes).toEqual(
      Object.keys(tokens.components.atoms.logoWithDescriptor.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(logoWithDescriptorModes).toEqual(
      Object.keys(tokens.themes.light.components.atoms.logoWithDescriptor)
    );
  });

  test("exports tones for neutral", () => {
    expect(logoWithDescriptorTones).toEqual(
      Object.keys(
        tokens.themes.light.components.atoms.logoWithDescriptor.neutral
      )
    );
  });
});
