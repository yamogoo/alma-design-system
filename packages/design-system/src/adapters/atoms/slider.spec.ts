import tokens from "@/tokens";

import {
  sliderVariants,
  sliderSizes,
  sliderModes,
  sliderTones,
  sliderStates,
} from "./slider";

describe("slider adapter", () => {
  test("exports all variants of the slider", () => {
    expect(sliderVariants).toEqual(Object.keys(tokens.components.atoms.slider));
  });

  test("exports sizes for variant default", () => {
    expect(sliderSizes).toEqual(
      Object.keys(tokens.components.atoms.slider.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(sliderModes).toEqual(
      Object.keys(tokens.themes.light.components.atoms.slider)
    );
  });

  test("exports tones for accent", () => {
    expect(sliderTones).toEqual(
      Object.keys(tokens.themes.light.components.atoms.slider.accent)
    );
  });

  test("exports states for track", () => {
    expect(sliderStates).toEqual(
      Object.keys(
        tokens.themes.light.components.atoms.slider.accent.primary.track
      )
    );
  });
});
