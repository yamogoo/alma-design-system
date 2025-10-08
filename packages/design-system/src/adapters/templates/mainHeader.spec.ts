import tokens from "@/tokens";

import {
  mainHeaderVariants,
  mainHeaderSizes,
  mainHeaderModes,
  mainHeaderTones,
} from "./mainHeader";

describe("mainHeader adapter", () => {
  test("exports all variants of the mainHeader", () => {
    expect(mainHeaderVariants).toEqual(
      Object.keys(tokens.components.templates.mainHeader)
    );
  });

  test("exports sizes for variant default", () => {
    expect(mainHeaderSizes).toEqual(
      Object.keys(tokens.components.templates.mainHeader.default)
    );
  });

  test("exports modes from the light theme", () => {
    expect(mainHeaderModes).toEqual(
      Object.keys(tokens.themes.light.components.templates.mainHeader)
    );
  });

  test("exports tones for neutral", () => {
    expect(mainHeaderTones).toEqual(
      Object.keys(tokens.themes.light.components.templates.mainHeader.neutral)
    );
  });
});
