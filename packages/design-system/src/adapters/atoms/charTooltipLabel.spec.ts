import tokens from "@/tokens";

import {
  charTooltipLabelVariants,
  charTooltipLabelSizes,
  charTooltipLabelModes,
  charTooltipLabelTones,
} from "./charTooltipLabel";

describe("charTooltipLabel adapter", () => {
  test("exports all variants of the charTooltipLabel", () => {
    expect(charTooltipLabelVariants).toEqual(
      Object.keys(tokens.components.atoms.charTooltipLabel)
    );
  });

  test("exports sizes for variant default", () => {
    expect(charTooltipLabelSizes).toEqual(
      Object.keys(tokens.components.atoms.charTooltipLabel.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(charTooltipLabelModes).toEqual(
      Object.keys(tokens.themes.light.components.atoms.charTooltipLabel)
    );
  });

  test("exports tones for neutral", () => {
    expect(charTooltipLabelTones).toEqual(
      Object.keys(tokens.themes.light.components.atoms.charTooltipLabel.neutral)
    );
  });
});
