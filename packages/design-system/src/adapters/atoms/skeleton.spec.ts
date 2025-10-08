import tokens from "@/tokens";

import {
  skeletonVariants,
  skeletonSizes,
  skeletonModes,
  skeletonTones,
} from "./skeleton";

describe("skeleton adapter", () => {
  test("exports all variants of the skeleton", () => {
    expect(skeletonVariants).toEqual(
      Object.keys(tokens.components.atoms.skeleton)
    );
  });

  test("exports sizes for variant default", () => {
    expect(skeletonSizes).toEqual(
      Object.keys(tokens.components.atoms.skeleton.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(skeletonModes).toEqual(
      Object.keys(tokens.themes.light.components.atoms.skeleton)
    );
  });

  test("exports tones for neutral", () => {
    expect(skeletonTones).toEqual(
      Object.keys(tokens.themes.light.components.atoms.skeleton.neutral)
    );
  });
});
