import tokens from "@/tokens";

import {
  navigationRailVariants,
  navigationRailSizes,
  navigationRailModes,
  navigationRailTones,
} from "./navigationRail";

describe("navigationRail adapter", () => {
  test("exports all variants of the navigationRail", () => {
    expect(navigationRailVariants).toEqual(
      Object.keys(tokens.components.templates.navigationRail)
    );
  });

  test("exports sizes for variant default", () => {
    expect(navigationRailSizes).toEqual(
      Object.keys(tokens.components.templates.navigationRail.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(navigationRailModes).toEqual(
      Object.keys(tokens.themes.light.components.templates.navigationRail)
    );
  });

  test("exports tones for neutral", () => {
    expect(navigationRailTones).toEqual(
      Object.keys(
        tokens.themes.light.components.templates.navigationRail.neutral
      )
    );
  });
});
