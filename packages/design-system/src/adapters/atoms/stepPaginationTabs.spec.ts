import tokens from "@/tokens";

import {
  stepPaginationTabsVariants,
  stepPaginationTabsSizes,
  stepPaginationTabsModes,
  stepPaginationTabsTones,
} from "./stepPaginationTabs";

describe("stepPaginationTabs adapter", () => {
  test("exports all variants of the stepPaginationTabs", () => {
    expect(stepPaginationTabsVariants).toEqual(
      Object.keys(tokens.components.atoms.stepPaginationTabs)
    );
  });

  test("exports sizes for variant default", () => {
    expect(stepPaginationTabsSizes).toEqual(
      Object.keys(tokens.components.atoms.stepPaginationTabs.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(stepPaginationTabsModes).toEqual(
      Object.keys(tokens.themes.light.components.atoms.stepPaginationTabs)
    );
  });

  test("exports tones for neutral", () => {
    expect(stepPaginationTabsTones).toEqual(
      Object.keys(
        tokens.themes.light.components.atoms.stepPaginationTabs.neutral
      )
    );
  });
});
