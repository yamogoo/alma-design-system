import tokens from "@/tokens";

import {
  mainFooterVariants,
  mainFooterSizes,
  mainFooterModes,
  mainFooterTones,
} from "./mainFooter";

describe("mainFooter adapter", () => {
  test("exports all variants of the mainFooter", () => {
    expect(mainFooterVariants).toEqual(
      Object.keys(tokens.components.templates.mainFooter)
    );
  });

  test("exports sizes for variant default", () => {
    expect(mainFooterSizes).toEqual(
      Object.keys(tokens.components.templates.mainFooter.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(mainFooterModes).toEqual(
      Object.keys(tokens.themes.light.components.templates.mainFooter)
    );
  });

  test("exports tones for neutral", () => {
    expect(mainFooterTones).toEqual(
      Object.keys(tokens.themes.light.components.templates.mainFooter.neutral)
    );
  });
});
