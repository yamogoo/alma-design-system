import tokens from "@/tokens";

import {
  treeViewVariants,
  treeViewSizes,
  treeViewModes,
  treeViewTones,
} from "./treeView";

describe("treeView adapter", () => {
  test("exports all variants of the treeView", () => {
    expect(treeViewVariants).toEqual(
      Object.keys(tokens.components.molecules.treeView)
    );
  });

  test("exports sizes for variant default", () => {
    expect(treeViewSizes).toEqual(
      Object.keys(tokens.components.molecules.treeView.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(treeViewModes).toEqual(
      Object.keys(tokens.themes.light.components.molecules.treeView)
    );
  });

  test("exports tones for neutral", () => {
    expect(treeViewTones).toEqual(
      Object.keys(tokens.themes.light.components.molecules.treeView.neutral)
    );
  });
});
